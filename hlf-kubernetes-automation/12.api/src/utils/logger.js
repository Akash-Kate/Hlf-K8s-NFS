// Handling Logging Mechanism
// winston.js
const winston = require("winston");
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require("fs");
const path = require("path");

// Define the path to the logs directory one level up
const logsDir = path.join(__dirname, "..", "logs");

// Check if logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir); // Create logs directory if it doesn't exist
}

const logPath = logsDir + "/BlockchainServer-%DATE%.log"

const customLevels = {
  levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
  },
  colors: {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      debug: 'blue'
  }
};

const logger = winston.createLogger({
  // Default level for logs
  level: "debug",
  levels: customLevels.levels,
  // Default format for logs
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),

  transports: [
    // Write all logs with importance level of error or less to error.log in a logstash format
    new winston.transports.Console(),
    new DailyRotateFile({
            filename: logPath,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: null,
            maxFiles: '30d'
    })
  ],
});

// exporting logger obj
module.exports = logger;
