import { RequestHandler, Request, Response, NextFunction } from "express";
import { getUserCookie } from "./get-user-cookie.js";

export const authorizedRoute =
  (requestHandler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getUserCookie(req);

    if (userId === undefined) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      // The user cookie exists so allow the request.
      requestHandler(req, res, next);
    }
  };
