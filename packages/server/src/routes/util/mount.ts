import { Request, Response } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const asyncExec = promisify(exec);

export const mount = async (req: Request, res: Response) => {
  const appleScript = `
    try
      mount volume "smb://admin:70sFlyingV!@10.0.0.10/public"
    on error errMsg
      return "ERROR: " & errMsg
    end try
  `;

  const command = `osascript -e '${appleScript.replace(/'/g, "'\\''")}'`;

  let error = false;

  try {
    const { stdout } = await asyncExec(command);
    if (stdout.trim().startsWith("ERROR:")) {
      console.error("AppleScript error:", stdout.trim());
      error = true;
    } else {
      console.log("Mounted successfully:", stdout.trim());
    }
  } catch (error) {
    console.error(
      "Execution failed:",
      (error as Error)?.message ?? "Unknown error"
    );
    error = true;
  }

  res.send({
    error,
  });
};
