import express from "express";
import accountsRouter from "./routes/account.js";
import winston from 'winston';
import cors from 'cors';

global.fileName = "accounts.json";

const { combine, timestamp, label, printf } = winston.format;
const myformat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level} : ${message}`;
});

global.logger = winston.createLogger({
    level: "silly", 
    format: winston.format.json(),
    transports: [        
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "minha-API.log" })
    ],
    format: combine(
        label({ label: "minha-API"}),
        timestamp(), 
        myformat
    )
});

const app = express();
app.use(express.json());
//liberar todos os endpoits externos
app.use(cors());
app.use("/account", accountsRouter);
import { cp, promises as fs } from "fs";

const {
    readFile,
    writeFile
} = fs;

app.listen(3000, async () => {
    try {
        await readFile(global.fileName);
        logger.info("API iniciada com sucesso...");
    } catch (err) {
        const initialJSON = {
            nextId: 1,
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(initialJSON)).then(() => {
            logger.info("API iniciada com sucesso e arquivo JSON criado...");
        }).catch(err => {
            logger.error(err)
        });
    }    
});