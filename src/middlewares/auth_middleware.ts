// import jwt from "jsonwebtoken";
// import * as dotenv from "dotenv";
// import { Request, Response, NextFunction, RequestHandler } from "express";

// interface IAuthenticationType {
//   id: string;
//   isUser: boolean;
// }

// dotenv.config();
// const JWT_SECRET = process.env.KEY;
// declare module "express" {
//   interface Request {
//     user?: unknown;
//   }
// }

// export const tokenProtect: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded: unknown = jwt.verify(token, JWT_SECRET as string);
//       const decodedPayload = decoded as IAuthenticationType;
//       req.user = await UserRole.findOne({ userId: decodedPayload.id }).select(
//         "-password"
//       );
//       if (decoded) {
//         if (req.user) {
//           req.user;
//           next();
//         } else {
//           res.json({
//             Type: "Success",
//             Success: false,
//             Status: 401,
//             Message: "Please authenticate!!!",
//           });
//           return;
//         }
//       } else {
//         res.json({
//           Type: "Success",
//           Success: false,
//           Status: 401,
//           Message: "Invalid token!!!",
//         });
//         return;
//       }
//     } else {
//       res.json({
//         Type: "Success",
//         Success: false,
//         Status: 401,
//         Message: "Please authenticate!!!",
//       });
//       return;
//     }
//   } catch (error) {
//     res.status(500).json({
//       Type: "Success",
//       Success: false,
//       Status: 500,
//       Message: "Internal server error!!!",
//     });
//     return;
//   }
// };
