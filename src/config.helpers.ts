import { DEFAULT_PATHS, ENV_PATHS, MODE } from "./config.const";
import { WebpackMode, WebpackPaths } from "./config.types";
import * as path from "path";

export function resolvePath(basePath: string, filePath: string): string {
  return path.resolve(basePath, filePath);
}

export function getIsDev(): boolean {
  return !!process.env.IS_PROD;
}

export function getMode(): WebpackMode {
  return !process.env.IS_PROD ? MODE.DEV : MODE.DEV;
}

export function getPaths(): WebpackPaths {
  const env = process.env;

  return ENV_PATHS.reduce<WebpackPaths>(
    (acc, key) => {
      if (env[key]) acc[key] = env[key];
      return acc;
    },
    { ...DEFAULT_PATHS }
  );
}

export function getPort(): number {
  return Number(process.env.PORT ?? 3000);
}
