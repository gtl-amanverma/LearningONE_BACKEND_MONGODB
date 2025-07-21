import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// import routes //
// User authentication route //
import { route } from "./routes/route";

// Define the method and origin //
const options = {
  origin: "http://localhost:3005",
  methods:
    "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS, get, head, put, patch, post, delete, options",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
// define app and logic //
export const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction): void => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    res.status(200).json({});
    return;
  }
  next();
});

// Route //
const PRIVATE_ROUTE = "/api/v1/private/auth/user/fetch";

// User authentication route //
app.use(PRIVATE_ROUTE, [route]);
