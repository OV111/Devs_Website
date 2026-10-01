import useProfileStore from "@/stores/useProfileStore";

// Ask Cloudinary for a 64px crop instead of downloading the full upload.
const thumbnail = (url) =>
  url.replace("/upload/", "/upload/w_64,h_64,c_fill,f_auto,q_auto/");

const initials = (user) =>
  `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

const AvatarImage = ({ inDropdown = false }) => {
  const { user, stats } = useProfileStore();

  return (
    <div
      className={`my-1 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border ${
        inDropdown ? "border-gray-600" : "border-white/50"
      }`}
    >
      {stats?.profileImage ? (
        <img
          src={thumbnail(stats.profileImage)}
          alt=""
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span
          className={`flex h-full w-full items-center justify-center rounded-full text-sm font-semibold text-white ${
            inDropdown ? "bg-purple-600" : "bg-white/20"
          }`}
        >
          {initials(user)}
        </span>
      )}
    </div>
  );
};

export default AvatarImage;
