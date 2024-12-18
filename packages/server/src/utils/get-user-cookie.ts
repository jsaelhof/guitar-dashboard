import { Request } from "express";

export const getUserCookie = (req: Request): { userId: string } => {
  if (req.cookies.user) {
    return JSON.parse(req.cookies.user);
  } else {
    throw "No user cookie";
  }
};
