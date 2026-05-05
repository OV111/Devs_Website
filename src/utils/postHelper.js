export const encodePostId = (post) => {
  const isDefault = post.isDefault === true;
  const prefix = isDefault ? "sys" : "blog";
  const rawId = isDefault ? post.id : post._id;
  return `${prefix}_${rawId}`;
};

export const decodePostId = (prefixedId) => {
  const [type, ...rest] = prefixedId.split("_");
  return {
    type,
    rawId: rest.join("_"),
  };
};
