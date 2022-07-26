/**
 * Remove old files, copy front-end ones.
 */

import childProcess from "child_process";
import fs from "fs-extra";
import logger from "jet-logger";

(async () => {
  try {
    // Remove current build
    await remove("./dist/");
    // Copy config files
    await copy(
      "./src/pre-start/env/production.env",
      "./dist/pre-start/env/production.env"
    );
    // Compile project
    await exec("tsc --project ./", "./");
  } catch (err) {
    logger.err(err);
  }
})();

function remove(loc: string): Promise<void> {
  return new Promise((res, rej) =>
    fs.remove(loc, (err: any) => (err ? rej(err) : res()))
  );
}

function copy(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) =>
    fs.copy(src, dest, (err: any) => (err ? rej(err) : res()))
  );
}

function exec(cmd: string, loc: string): Promise<void> {
  return new Promise((res, rej) =>
    childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (stdout) {
        logger.info(stdout);
      }
      if (stderr) {
        logger.warn(stderr);
      }
      return err ? rej(err) : res();
    })
  );
}
