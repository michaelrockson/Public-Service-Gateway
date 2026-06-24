import winston from "winston";
import { config } from "../utils/env.config";

const isProduction = config.isProduction;

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }),
];

if (isProduction) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  );
}

const logger = winston.createLogger({
  level: config.logLevel || "info",
  exitOnError: false,
  format: winston.format.combine(
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
});

export default logger;
