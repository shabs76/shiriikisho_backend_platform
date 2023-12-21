import  { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, prettyPrint } = format;

export const devLogger = () => {
    return createLogger({
        level: 'debug',
        format: combine(
          timestamp(),
          prettyPrint()
        ),
        transports: [new transports.Console()]
    });
}

export const proLogger = () => {
    return createLogger({
        level: 'info',
        format: combine(
          timestamp(),
          prettyPrint()
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'errorLogs.log', level: 'error' }),
            new transports.File({ filename: 'infoLogs.log', level: 'info' })
        ]
    });
}