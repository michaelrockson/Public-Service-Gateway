import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  exitOnError: false,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.ENVIRONMENT === "production") {
  logger.add(
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  );
  logger.add(new winston.transports.File({ filename: "logs/combined.log" }));
}

export default logger;
