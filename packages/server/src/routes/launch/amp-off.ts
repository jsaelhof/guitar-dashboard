import { Request, Response } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const asyncExec = promisify(exec);

export const ampOff = async (req: Request, res: Response) => {
  await asyncExec(`osascript -e 'quit app "Guitar Rig 5"'`);

  res.send({
    error: false,
  });
};
