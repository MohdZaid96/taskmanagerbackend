const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message,  timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    format.colorize(),
    timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
    format.errors({stack:true}),
    myFormat
  ),
  //defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console()
  ],
});

module.exports=logger; 