import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretkey";

export interface TokenResponseType {
  id: string;
  userName: string;
  userEmail: string;
}

export const decodeToken = (token: string): Promise<TokenResponseType> => {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenResponseType;

  const newData = {
    id: decoded.id,
    userName: decoded.userName,
    userEmail: decoded.userEmail,
  };

  return Promise.resolve(newData);
};
