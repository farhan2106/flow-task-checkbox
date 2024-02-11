import { NextFunction, Request, Response } from "express";

export function verifyOrigin(req: Request): Boolean {
  const allowlist = [
    "http://localhost:3000"
  ];
  if (allowlist.indexOf(req.header("Origin") || "") !== -1) {
    return true;
  }
  return false;
}

export function verifyOriginMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (verifyOrigin(req)) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}
