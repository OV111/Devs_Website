// NavLink matches on pathname only, so a hash link like "/#how-it-works"
// would show as active on every visit to "/". Hash links compare the full
// path + hash instead; everything else keeps NavLink's own answer.
export const isNavLinkActive = (to, { pathname, hash }, isActive) =>
  to.includes("#") ? `${pathname}${hash}` === to : isActive;
