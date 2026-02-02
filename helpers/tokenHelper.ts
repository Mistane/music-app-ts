import jwt from "jsonwebtoken";

type Data = {
  userId: string;
  username: string;
  roles?: [string];
};

const generateAccessToken = (data: Data): string => {
  const token = jwt.sign(data, process.env.ACCESS_KEY, { expiresIn: "1h" });
  return token;
};

const genrateRefreshToken = (data: Data): string => {
  const token = jwt.sign(data, process.env.REFRESH_KEY);
  return token;
};

export { generateAccessToken, genrateRefreshToken, Data };
