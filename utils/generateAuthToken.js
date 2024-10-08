import jwt from "jsonwebtoken";

export const generateAuthToken = (id, time = "15m") => {
  try {
    let token = jwt.sign({ userID: id }, process.env.JWTSECRETKEY, {
      expiresIn: time,
    });
    return token;
  } catch (error) {
    return new Error(error.message);
  }
};
