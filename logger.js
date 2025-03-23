const winston = require("winston");

const { createLogger, format, transports } = winston;

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  level: "debug",
  transports: [
    new transports.File({ filename: "/var/log/myapp.log" }),
    new transports.Console(),
  ],
});

module.exports = { logger };
