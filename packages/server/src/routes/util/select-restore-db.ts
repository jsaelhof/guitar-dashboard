import { Request, Response } from "express";
import { exec } from "child_process";
import { promisify } from "util";
import { readdir, stat } from "fs/promises";
import { join } from "path";

const asyncExec = promisify(exec);

export const selectRestoreDB = async (req: Request, res: Response) => {
  try {
    const directory = process.env.BACKUP_DIR ?? "";
    const items = await readdir(directory);
    const files = [];

    // Process each item - only add files
    for (const name of items) {
      try {
        const itemPath = join(directory, name);
        const itemStats = await stat(itemPath);

        if (itemStats.isFile() && !name.startsWith(".")) {
          files.push({
            name: name,
            path: itemPath,
          });
        }
      } catch (err) {}
    }

    // Sort files alphabetically
    files.sort((a, b) => b.name.localeCompare(a.name));

    res.send({
      error: false,
      files,
    });
  } catch (err) {
    res.send({
      error: true,
      scope: "utils",
      type: "selectRestoreDB",
    });
  }
};
