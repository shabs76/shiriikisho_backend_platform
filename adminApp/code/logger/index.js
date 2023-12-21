import dotenv from 'dotenv';
import { devLogger, proLogger } from './loggerConf.js';
dotenv.config();

let logger = null;

if (process.env.NODE_MODE === 'development') {
    logger = devLogger();
}

if (process.env.NODE_MODE === 'production') {
    logger = proLogger();
}

export default logger;