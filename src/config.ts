import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import * as dotenv from "dotenv";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import webpack from "webpack";
import { ENV_FILE_PATH } from "./config.const";
import {
  getIsDev,
  getMode,
  getPaths,
  getPort,
  resolvePath,
} from "./config.helpers";
import {
  CreateConfigParams,
  WebpackConfig,
  WebpackOverridesConfig,
} from "./config.types";

function initEnvironments(dirName: string, envPath: string): void {
  dotenv.config({
    path: resolvePath(dirName, envPath),
  });
}

function initWebpackConfig(
  dirName: string,
  overrides: WebpackOverridesConfig = {}
): WebpackConfig {
  const paths = getPaths();
  const mode = getMode();
  const isDev = getIsDev();
  const port = getPort();

  const baseConfig: WebpackConfig = {
    mode,
    entry: resolvePath(dirName, paths.ENTRY_PATH),
    output: {
      path: resolvePath(dirName, paths.OUTPUT_PATH),
      filename: "script/[name].[contenthash].js",
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolvePath(dirName, paths.HTML_PATH),
      }),
      new MiniCssExtractPlugin({ filename: "css/[name].[contenthash].css" }),
      new CopyPlugin({
        patterns: [
          {
            from: resolvePath(dirName, paths.COPY_STATIC_FROM_PATH),
            to: resolvePath(dirName, paths.COPY_STATIC_TO_PATH),
            noErrorOnMissing: true,
          },
        ],
      }),
      ...(isDev
        ? [
            new webpack.ProgressPlugin(),
            new ReactRefreshWebpackPlugin(),
            new ForkTsCheckerWebpackPlugin(),
          ]
        : []),
    ],
    module: {
      rules: [
        { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader"] },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              getCustomTransformers: () => ({
                before: isDev ? [ReactRefreshTypeScript()] : [],
              }),
              transpileOnly: isDev,
            },
          },
        },
        { test: /\.(png|jpg|jpeg|gif)$/i, type: "asset/resource" },
        { test: /\.(woff2?|eot|ttf|otf)$/i, type: "asset/resource" },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ["@svgr/webpack"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": resolvePath(dirName, "src"),
      },
    },
    ...(isDev && {
      devtool: "inline-source-map",
      devServer: {
        static: { directory: resolvePath(dirName, paths.DEV_STATIC_PATH) },
        compress: true,
        port: port,
        hot: true,
      },
    }),
  };

  return {
    ...baseConfig,
    ...overrides,
    module: {
      ...baseConfig.module,
      ...overrides.module,
      rules: [
        ...(baseConfig.module?.rules || []),
        ...(overrides.module?.rules || []),
      ],
    },
    plugins: [...(baseConfig.plugins || []), ...(overrides.plugins || [])],
  };
}

export function createWebpackConfig({
  dirName = process.cwd(),
  envPath = ENV_FILE_PATH,
  overrides,
}: CreateConfigParams = {}): WebpackConfig {
  initEnvironments(dirName, envPath);
  return initWebpackConfig(dirName, overrides);
}
