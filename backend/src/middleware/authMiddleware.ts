import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWTSECRET = process.env.JWTSECRET || "";

interface JwtPayload {
  id: string;
}

export const authMiddlewere = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ msg: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWTSECRET) as JwtPayload;
    (req as any).userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid or expired token." });
    return;
  }
};
