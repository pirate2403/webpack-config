import * as dotenv from "dotenv";
import { ENV_FILE_PATH } from "./config.const";
import { resolvePath } from "./config.helpers";
import { createWebpackMfPluginBase } from "./config.mf-plugin-base";
import {
  CreateConfigParams,
  MfPluginParams,
  WebpackOverridesConfig,
} from "./config.types";
import { createWebpackConfigBase } from "./config.webpack-base";

function initEnvironments(dirName: string, envPath: string): void {
  dotenv.config({
    path: resolvePath(dirName, envPath),
  });
}

export function prepareConfigCreators({
  dirName = process.cwd(),
  envPath = ENV_FILE_PATH,
}: CreateConfigParams = {}) {
  initEnvironments(dirName, envPath);
  return {
    createWebpackConfig: (overrides: WebpackOverridesConfig) => {
      return createWebpackConfigBase(dirName, overrides);
    },
    createWebpackMfPlugin: (params: MfPluginParams) => {
      return createWebpackMfPluginBase(dirName, params);
    },
  };
}
