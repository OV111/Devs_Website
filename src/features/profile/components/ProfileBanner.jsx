import React, { useState } from "react";

// The grid pattern for the empty state: reads as designed, not as a missing photo.
const GRID_PATTERN = {
  backgroundImage:
    "linear-gradient(rgba(168,85,247,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.10) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

/**
 * Banner photo with a blur-up: a tiny blurred copy (a few hundred bytes from
 * Cloudinary) paints instantly behind the real image, which fades in once loaded,
 * so the strip never flashes empty while the photo downloads.
 */
function BannerImage({ url }) {
  const [loaded, setLoaded] = useState(false);
  const full = url.replace("/upload/", "/upload/w_1500,h_350,c_fill,g_auto,f_auto,q_auto/");
  const tiny = url.replace("/upload/", "/upload/w_40,h_10,c_fill,g_auto,e_blur:300,q_30/");
  return (
    <div
      className="h-40 w-full bg-gray-900 bg-cover bg-center sm:h-56"
      style={{ backgroundImage: `url(${tiny})` }}
    >
      <img
        src={full}
        alt="Banner"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

/**
 * Banner strip shared by the owner's profile and public profiles, so the two
 * pages can't drift apart. `children` render on top (edit buttons, avatar).
 */
export default function ProfileBanner({ url, children }) {
  return (
    <div className="relative group">
      {url ? (
        <BannerImage url={url} />
      ) : (
        // No banner set: a brand-color gradient with a faint grid reads as an
        // intentional empty state, not a real photo.
        <div
          className="h-40 w-full bg-linear-to-br from-purple-950 via-gray-950 to-gray-950 sm:h-56"
          style={GRID_PATTERN}
        />
      )}
      {/* Light edge fades only: heavy ones covered most of a 160px phone banner.
          The bottom one just blends the strip into the page below. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-gray-950/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-gray-950/70 to-transparent" />
      {children}
    </div>
  );
}
