import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBlocker } from "react-router-dom";
import DeleteAccount from "@/features/profile/components/DeleteAccount";
import { toast } from "react-hot-toast";
import PageShell from "./components/PageShell";
import SaveBar from "./components/SaveBar";
import useProfileStore from "@/stores/useProfileStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "@/stores/useThemeStore";
import ImageDropZone from "./components/ImageDropZone";
import { saveSettings, checkUsernameAvailable } from "@/services/profileApi";
import { Loader2, Check, X } from "lucide-react";
import { INPUT_CLASS } from "@/components/ui/field";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const LABEL_CLASS = "text-sm font-medium text-gray-700 dark:text-gray-300";

// One labelled field. `htmlFor`/`id` tie the label to the control, so a click
// on the label focuses it and screen readers announce it. `as` picks the
// control; every kind shares INPUT_CLASS so they can't drift apart.
const TextField = ({
  id,
  label,
  loading,
  skeletonProps,
  as: Control = "input",
  className = "",
  children,
  ...controlProps
}) => {
  const extra =
    Control === "textarea" ? { rows: 3 } : Control === "input" ? { type: "text" } : {};
  return (
    <div className={`grid gap-2 w-full ${className}`}>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      {loading ? (
        <Skeleton height={Control === "textarea" ? 84 : 38} {...skeletonProps} />
      ) : (
        <Control id={id} name={id} className={INPUT_CLASS} {...extra} {...controlProps}>
          {children}
        </Control>
      )}
    </div>
  );
};

// IANA zones from the browser, labelled with today's UTC offset. Built once.
const TIMEZONES = (() => {
  if (typeof Intl.supportedValuesOf !== "function") return [];
  const now = new Date();
  const offset = (timeZone) => {
    try {
      const part = new Intl.DateTimeFormat("en", { timeZone, timeZoneName: "shortOffset" })
        .formatToParts(now)
        .find((p) => p.type === "timeZoneName");
      return part ? part.value.replace("GMT", "UTC") : "";
    } catch {
      return "";
    }
  };
  return Intl.supportedValuesOf("timeZone").map((tz) => ({
    value: tz,
    label: `${tz.replace(/_/g, " ")} (${offset(tz) || "UTC"})`,
  }));
})();

// Users type "github.com/x" without a scheme; the server only accepts http(s),
// so add https:// here instead of rejecting a perfectly good link.
const LINK_KEYS = ["githubLink", "linkedinLink", "twitterLink", "mediumLink"];
const withScheme = (value) =>
  value && !/^https?:\/\//i.test(value.trim()) ? `https://${value.trim()}` : value;

const Settings = () => {
  const { user, stats, isLoading, fetchProfile, updateStats, updateUser } =
    useProfileStore();
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const skeletonProps = {
    borderRadius: 8,
    baseColor: isDarkMode ? "#1f2937" : "#ebebeb",
    highlightColor: isDarkMode ? "#374151" : "#f5f5f5",
  };
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    username: "",
    bio: "",
    location: "",
    timezone: "",
    postsCount: 0,
    githubLink: "",
    linkedinLink: "",
    twitterLink: "",
    mediumLink: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // idle | checking | available | taken | invalid
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const usernameCheckTimeout = useRef(null);

  useEffect(() => {
    const uname = formData.username;

    // Nothing typed, or it's still the user's current username — no need
    // to hit the server just to confirm they own their own name.
    if (!uname || uname === originalData.username) {
      setUsernameStatus("idle");
      return;
    }
    if (uname.length < 3) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");
    clearTimeout(usernameCheckTimeout.current);
    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const { available } = await checkUsernameAvailable(uname);
        setUsernameStatus(available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 400);

    return () => clearTimeout(usernameCheckTimeout.current);
  }, [formData.username, originalData.username]);

  useEffect(() => {
    if (!user && !stats) fetchProfile();
  }, []);

  useEffect(() => {
    if (!user || !stats) return;
    const userData = {
      fname: user.firstName || "",
      lname: user.lastName || "",
      username: user.username || "",
      bio: stats.bio || "",
      location: stats.location || "",
      timezone: stats.timezone || "",
      postsCount: stats.postsCount || 0,
      githubLink: stats.githubLink || "",
      linkedinLink: stats.linkedinLink || "",
      twitterLink: stats.twitterLink || "",
      mediumLink: stats.mediumLink || "",
    };
    setFormData(userData);
    setOriginalData(userData);
  }, [user, stats]);

  const SaveChanges = async () => {
    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      toast.error("Please choose an available username");
      return;
    }
    if (usernameStatus === "checking") {
      toast.error("Still checking that username, one sec");
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key]) {
          formDataToSend.append(
            key,
            LINK_KEYS.includes(key) ? withScheme(formData[key]) : formData[key],
          );
        }
      });
      if (profileImage) formDataToSend.append("profileImage", profileImage);
      if (bannerImage) formDataToSend.append("bannerImage", bannerImage);

      const response = await saveSettings(formDataToSend);

      const updatedData = {
        fname: response.user.firstName || "",
        lname: response.user.lastName || "",
        username: response.user.username || "",
        bio: response.stats.bio || "",
        location: response.stats.location || "",
        timezone: response.stats.timezone || "",
        postsCount: response.stats.postsCount || 0,
        githubLink: response.stats.githubLink || "",
        linkedinLink: response.stats.linkedinLink || "",
        twitterLink: response.stats.twitterLink || "",
        mediumLink: response.stats.mediumLink || "",
      };
      setFormData(updatedData);
      setOriginalData(updatedData);
      updateUser(response.user);
      updateStats(response.stats);
      toast.success(response.message || "Changes saved successfully");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setProfileImage(null);
      setBannerImage(null);
    } catch (err) {
      toast.error(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Dirty = any field differs from what the server last gave us, or a new
  // image is waiting. `originalData` is empty until the profile has loaded.
  const isDirty = useMemo(
    () =>
      Object.keys(originalData).length > 0 &&
      (Object.keys(formData).some((k) => formData[k] !== originalData[k]) ||
        Boolean(profileImage) ||
        Boolean(bannerImage)),
    [formData, originalData, profileImage, bannerImage],
  );

  const discard = () => {
    setFormData(originalData);
    setProfileImage(null);
    setBannerImage(null);
    setUsernameStatus("idle");
  };

  // Ctrl/Cmd+S saves. The ref keeps the listener pointing at the latest
  // SaveChanges without re-subscribing on every keystroke.
  const saveRef = useRef(SaveChanges);
  saveRef.current = SaveChanges;
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (isDirty) saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDirty]);

  // Guard against losing edits: closing/reloading the tab, and in-app navigation.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const blocker = useBlocker(isDirty);
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <PageShell
        title="Settings"
        subtitle="Manage your account settings and preferences"
      >
        <div className="mt-8 pb-24">
          <div className="grid gap-8" id="general">
            <div className="grid gap-5 sm:grid-cols-2 max-w-[880px]">
              <TextField
                id="fname"
                label="First name"
                loading={isLoading}
                skeletonProps={skeletonProps}
                value={formData.fname}
                placeholder="First name"
                onChange={(e) => handleChange("fname", e.target.value)}
              />
              <TextField
                id="lname"
                label="Last name"
                loading={isLoading}
                skeletonProps={skeletonProps}
                value={formData.lname}
                placeholder="Last name"
                onChange={(e) => handleChange("lname", e.target.value)}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 max-w-[880px]">
              <div className="grid gap-2 w-full">
                <label htmlFor="username" className={LABEL_CLASS}>
                  Username
                </label>
                {isLoading ? (
                  <Skeleton height={38} {...skeletonProps} />
                ) : (
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="off"
                      value={formData.username}
                      placeholder="username"
                      maxLength={16}
                      aria-invalid={
                        usernameStatus === "taken" || usernameStatus === "invalid"
                      }
                      className={`${INPUT_CLASS} pr-9 ${
                        usernameStatus === "taken" ||
                        usernameStatus === "invalid"
                          ? "border-red-400! dark:border-red-500!"
                          : usernameStatus === "available"
                            ? "border-green-400! dark:border-green-500!"
                            : ""
                      }`}
                      onChange={(e) =>
                        handleChange(
                          "username",
                          // Mirrors the backend's sanitizeUsername so a user
                          // never types a character the server will reject.
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, ""),
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === "checking" && (
                        <Loader2
                          size={16}
                          className="animate-spin text-gray-400"
                        />
                      )}
                      {usernameStatus === "available" && (
                        <Check size={16} className="text-green-500" />
                      )}
                      {(usernameStatus === "taken" ||
                        usernameStatus === "invalid") && (
                        <X size={16} className="text-red-500" />
                      )}
                    </span>
                  </div>
                )}
                {usernameStatus === "taken" ? (
                  <p className="text-xs text-red-500">
                    That username is already taken.
                  </p>
                ) : usernameStatus === "invalid" ? (
                  <p className="text-xs text-red-500">
                    Username must be at least 3 characters.
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Lowercase letters and numbers only, 3–16 characters. This is
                    your public profile link.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row max-w-[880px]">
              {isLoading ? (
                <>
                  <div className="flex-1">
                    <Skeleton height={120} {...skeletonProps} />
                  </div>
                  <div className="flex-1">
                    <Skeleton height={120} {...skeletonProps} />
                  </div>
                </>
              ) : (
                <>
                  <ImageDropZone
                    label="Profile Image"
                    image={profileImage}
                    currentUrl={stats?.profileImage}
                    onImageChange={setProfileImage}
                  />
                  <ImageDropZone
                    label="Banner Image"
                    image={bannerImage}
                    currentUrl={stats?.bannerImage}
                    onImageChange={setBannerImage}
                  />
                </>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 max-w-[880px]">
              <TextField
                id="bio"
                label="Bio"
                loading={isLoading}
                skeletonProps={skeletonProps}
                as="textarea"
                className="sm:col-span-2"
                value={formData.bio}
                placeholder="Tell others a bit about yourself and what you're passionate about..."
                onChange={(e) => handleChange("bio", e.target.value)}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 max-w-[880px]">
              <TextField
                id="timezone"
                label="Time zone"
                loading={isLoading}
                skeletonProps={skeletonProps}
                as="select"
                value={formData.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
              >
                <option value="">Select a time zone</option>
                {/* Keep a legacy free-text value (e.g. "UTC +4") selectable. */}
                {formData.timezone &&
                  !TIMEZONES.some((t) => t.value === formData.timezone) && (
                    <option value={formData.timezone}>{formData.timezone}</option>
                  )}
                {TIMEZONES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </TextField>
              <TextField
                id="location"
                label="Location"
                loading={isLoading}
                skeletonProps={skeletonProps}
                value={formData.location}
                placeholder="City, Country"
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 max-w-[880px]">
              <TextField
                id="githubLink"
                label="GitHub"
                loading={isLoading}
                skeletonProps={skeletonProps}
                value={formData.githubLink}
                placeholder="Enter URL"
                inputMode="url"
                autoComplete="off"
                onChange={(e) => handleChange("githubLink", e.target.value)}
              />
              <TextField
                id="linkedinLink"
                label="LinkedIn"
                loading={isLoading}
                skeletonProps={skeletonProps}
                value={formData.linkedinLink}
                placeholder="Enter URL"
                inputMode="url"
                autoComplete="off"
                onChange={(e) => handleChange("linkedinLink", e.target.value)}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 max-w-[880px]">
              <TextField
                id="twitterLink"
                label="Twitter"
                loading={isLoading}
                skeletonProps={skeletonProps}
                value={formData.twitterLink}
                placeholder="Enter URL"
                inputMode="url"
                autoComplete="off"
                onChange={(e) => handleChange("twitterLink", e.target.value)}
              />
              <TextField
                id="mediumLink"
                label="Medium"
                loading={isLoading}
                skeletonProps={skeletonProps}
                value={formData.mediumLink}
                placeholder="Enter URL"
                inputMode="url"
                autoComplete="off"
                onChange={(e) => handleChange("mediumLink", e.target.value)}
              />
            </div>

            <DeleteAccount />
          </div>
        </div>
      </PageShell>
      {blocker.state === "blocked" && (
        <ConfirmDialog
          tone="primary"
          title="Leave without saving?"
          body="You have unsaved changes. If you leave now, they will be lost."
          confirmLabel="Leave"
          cancelLabel="Keep editing"
          onCancel={() => blocker.reset()}
          onConfirm={() => blocker.proceed()}
        />
      )}
      <SaveBar
        dirty={isDirty}
        saving={saving}
        saved={saved}
        onSave={SaveChanges}
        onDiscard={discard}
      />
    </>
  );
};

export default Settings;
