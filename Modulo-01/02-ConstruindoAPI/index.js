import express from "express";
import accountsRouter from "./routes/account.js";

global.fileName = "accounts.json";

const app = express();
app.use(express.json());
app.use("/account", accountsRouter);
import {
    promises as fs
} from "fs";

const {
    readFile,
    writeFile
} = fs;

app.listen(3000, async () => {
    try {
        await readFile(global.fileName);
        console.log("API iniciada com sucesso...");
    } catch (error) {
        const initialJSON = {
            nextId: 1,
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(initialJSON)).then(() => {
            console.log("API iniciada com sucesso e arquivo JSON criado...");
        }).catch(err => {
            console.log(err);
        });
    }    
});