import { Request, Response } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const asyncExec = promisify(exec);

export const backupDB = async (req: Request, res: Response) => {
  let error = false;

  try {
    const timestamp = new Date()
      .toISOString()
      .replace("T", "_") // Replace T with underscore
      .replace(/:/g, "-") // Replace colons with dashes
      .slice(0, 19); // Remove milliseconds and timezone

    const backupName = `backup_${timestamp}`;

    // Step 1: Backup to local temp directory first
    console.log("Starting mongodump to local temp...");
    const localBackupDir = `../../tmp`;
    const localBackupPath = `${localBackupDir}/${backupName}`;
    const localZipPath = `${localBackupDir}/${backupName}.zip`;

    await asyncExec(
      `mongodump --host ${process.env.DB_SERVER} --db ${process.env.DB_NAME} --out "${localBackupPath}"`
    );

    // Step 2: Create zip archive locally
    console.log("Creating zip archive locally...");
    await asyncExec(`zip -r "${localZipPath}" "${localBackupPath}"`);
    console.log("Local archive created successfully");

    // Step 3: Move to network drive
    const finalZipPath = `${process.env.BACKUP_DIR}/${backupName}.zip`;
    console.log(
      `Moving ${localZipPath} to ${finalZipPath} on network drive...`
    );
    await asyncExec(`mv "${localZipPath}" "${finalZipPath}"`);
    console.log("Archive moved to network drive");

    // Step 4: Cleanup local temp files
    console.log("Cleaning up local temp files...");
    await asyncExec(`rm -rf "${localBackupDir}"`);
    console.log("Cleanup completed");
  } catch (err) {
    error = true;
    console.error(
      err,
      "Execution failed:",
      (err as Error)?.message ?? "Unknown error"
    );
  } finally {
    res.send({
      error,
      scope: "utils",
      type: "backupDB",
    });
  }
};
