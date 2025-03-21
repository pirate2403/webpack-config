import webpack from "webpack";
import fs from "fs";
import { MfPluginParams, MfSharedConfig } from "./config.types";
import path from "path";
import { COMMON_DEPENDENCIES } from "./config.const";

export function createWebpackMfPlugin(
  params: MfPluginParams,
  dirName = process.cwd()
) {
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(dirName, "package.json"), "utf-8")
  );

  const dependencies = packageJson.dependencies ?? {};

  return new webpack.container.ModuleFederationPlugin({
    shared: COMMON_DEPENDENCIES.reduce<Record<string, MfSharedConfig>>(
      (acc, dep) => ({
        ...acc,
        [dep]: {
          singleton: true,
          eager: true,
          requiredVersion: dependencies[dep],
        },
      }),
      {}
    ),
    ...params,
  });
}
