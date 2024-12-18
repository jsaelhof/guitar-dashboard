import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  res.cookie("user", JSON.stringify({ userId: req.body.userId }));
  res.send();
};
