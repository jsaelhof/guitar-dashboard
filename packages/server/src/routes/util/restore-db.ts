import { Request, Response } from "express";
import { exec } from "child_process";
import { promisify } from "util";
import { dirname } from "path";

const asyncExec = promisify(exec);

export const restoreDB = async (
  req: Request<unknown, unknown, { backupZipPath: string }>,
  res: Response
) => {
  console.log(req.body);
  const { backupZipPath } = req.body;

  try {
    // Step 2: Create zip archive locally
    console.log("Extracting backup zip...");
    const { stdout, stderr } = await asyncExec(
      `unzip ${backupZipPath} -d ${dirname(backupZipPath)}`
    );
    console.log({ stdout, stderr });
    console.log("Backup unzipped successfully");

    res.send({
      error: false,
      scope: "utils",
      type: "restoreDB",
    });
  } catch (err) {
    console.log(err);
    res.send({
      error: true,
      scope: "utils",
      type: "restoreDB",
    });
  }
};
