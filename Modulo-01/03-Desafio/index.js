import express from "express";
import pedidosRouter from './routes/pedidos.js';
import winston from "winston";
import { cp, promises as fs } from "fs";

global.fileName = "pedidos.json";

const { combine, timestamp, label, printf } = winston.format;
const myformat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level} : ${message}`;
});

const {
    readFile,
    writeFile
} = fs;

global.logger = winston.createLogger({
    level: "silly",
    format: winston.format.json(),
    transports:[
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'Pedidos.log' })
    ],
    format: combine(
        label({ label: "Pedidos-API" }),
        timestamp(),
        myformat
    )
});

const app = express();
app.use(express.json());
app.use("/pedidos", pedidosRouter);

app.listen(3000, async () => {
    try {
        await readFile(global.fileName);
        global.logger.info("API iniciada com sucesso...");
    } catch (err) {
        const initialJson = {
            nextId: 1,
            pedidos: []
        }

        writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {
            global.logger.info("API iniciada com sucesso e arquivo pedidos.json criado com sucesso...");
        }).catch(err => {
            global.logger.error(err);
        })
    }
});