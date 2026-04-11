import jwt from "jsonwebtoken";
import process from "process";

export const createToken = (user) => {
  return jwt.sign(
    {id: user.id,},
    process.env.JWT_Secret,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  try {
   return jwt.verify(token,process.env.JWT_Secret)
  } catch(err) {
    return null;
  }
};