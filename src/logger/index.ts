import { pino } from "pino";

const pinoLogger = pino({
  level: process.env.ENV === "local" ? "debug" : "trace",
  enabled: !(process.env.NO_LOGS === "true"),
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true, // --colorize
      crlf: true, // --crlf
      levelFirst: true, // --levelFirst
      timestampKey: "time", // --timestampKey
      translateTime: "yyyy-mm-dd HH:MM:ss", // --translateTime
      ignore: "pid,hostname", // --ignore
    },
  },
});

export const logger = (name = ""): pino.Logger => {
  const pathToFile = name
    ? name.replace(/.+\/src/, "").replace(/.(js|ts)$/, "")
    : "";

  return pinoLogger.child({
    path: pathToFile,
  });
};

export const errorToLoggerProps = (error: Error, obj?: Record<string, any>) =>
  Object.assign({ error: pino.stdSerializers.err(error) }, obj);
