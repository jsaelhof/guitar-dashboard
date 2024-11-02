import { Request, Response } from "express";
import { exec } from "child_process";

export const amp = async (req: Request, res: Response) => {
  exec('open -a "Guitar Rig 5"', (error, stdout, stderr) => {
    console.log(error);
  });

  res.send({
    error: false,
    scope: "launch",
    type: "amp",
  });
};
