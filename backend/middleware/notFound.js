export const notFound = (req, res) => {
  res
    .status(404)
    .json({ message: `Route ${req.originalUrl} not found`, code: 404 });
};
