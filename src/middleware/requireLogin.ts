import { NextFunction, Request, Response } from "express";

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user?.id) return res.redirect("/auth/login");
  next();
}

