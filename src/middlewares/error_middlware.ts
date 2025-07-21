import { Request, Response, NextFunction } from "express";

const notFound = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
  return Promise.resolve();
};

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response
): Promise<void> => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({ success: false, message: (err as Error).message });
  return Promise.resolve();
};

export { notFound, errorHandler };
