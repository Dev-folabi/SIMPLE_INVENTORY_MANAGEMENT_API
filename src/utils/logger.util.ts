import winston from "winston";
import path from "path";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf((info) => {
    // For HTTP requests, format with detailed information
    if (
      info.level.includes("http") ||
      info.level.includes("warn") ||
      info.level.includes("error")
    ) {
      if (info.method && info.url && typeof info.status === "number") {
        const statusColor =
          info.status >= 500
            ? "\x1b[31m"
            : info.status >= 400
            ? "\x1b[33m"
            : "\x1b[32m";
        const resetColor = "\x1b[0m";
        return `${info.timestamp} [${info.level}]: ${info.method} ${info.url} ${statusColor}${info.status}${resetColor} - ${info.duration} - User: ${info.userId}`;
      }
    }
    // For other logs, use simple format
    return `${info.timestamp} [${info.level}]: ${info.message}`;
  })
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
  new winston.transports.File({
    filename: path.join("logs", "error.log"),
    level: "error",
    format,
  }),
  new winston.transports.File({
    filename: path.join("logs", "combined.log"),
    format,
  }),
];

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  levels,
  transports,
  exitOnError: false,
});

export const loggerStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
