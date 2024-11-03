import { Request, Response } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const asyncExec = promisify(exec);

export const ampStatus = async (req: Request, res: Response) => {
  try {
    const result = await asyncExec('pgrep "Guitar Rig 5"');

    res.send({
      error: false,
      state: !!result.stdout.trim(),
    });
  } catch (ex) {
    res.send({
      error: false,
      state: false,
    });
  }
};
