import express from "express";
import { promises as fs } from "fs";


global.fileName = "accounts.json";

const {
    readFile,
    writeFile
} = fs;
const router = express.Router();

router.post('/', async function (req, res, next) {
    try {
        let account = req.body;
        const data = JSON.parse(await readFile(global.fileName));

        //Se eu simplesmente criar o ID, ele irá para o final do arquivo, o que pode nao ser interessante
        //Com a abordagem abaixo, trago para cima em destaque o id
        account = {
            id: data.nextId++,
            ...account
        }
        //data.nextId++; nao necessário, conforme linha acima. 
        //colocar o ++ depois, significa que primeiro irá implementar e depois acrescentar
        //caso venha antes, ele irá incrementar e depois adicionar o valor do campo

        data.accounts.push(account);

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(account);
        global.logger.info(`POST /account - ${JSON.stringify(account)}`);
    } catch (error) {
        next(err);
    }
})

router.get('/', async function (req, res, next) {
    try {
        let data = JSON.parse(await readFile(global.fileName));
        //delete irá remover o campo id na visualização 
        delete data.nextId;
        res.send(data);
        global.logger.info(`GET /account`);
    } catch (err) {
        next(err);
    }
})

router.get('/:id', async function (req, res, next) {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const account = data.accounts.find(account => account.id === parseInt(req.params.id));
        if (account === undefined)
            res.send(`${req.params.id} não existe na base de dados.`);
        else
        {
            res.send(account);
            global.logger.info(`GET /account/:id - ${req.params.id}`);
        }
            
    } catch (err) {
        next(err);
    }
})

router.delete('/:id', async function (req, res, next) {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        //o filter irá retornar tudo que é diferente de req.params.id
        data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id));

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        //res.end();
        res.send(`Elemento ${req.params.id} removido com sucesso`);
        global.logger.info(`DELETE /account/:id - ${req.params.id}`);
    } catch (err) {
        next(err);
    }
})

router.put("/", async function(req, res, next){
    try {
        const account = req.body;

        const data = JSON.parse(await readFile(global.fileName));
        const index = data.accounts.findIndex(a => a.id === account.id);

        data.accounts[index] = account;

        await writeFile(global.fileName, JSON.stringify(data));
        delete data.nextId;
        res.send(data);
        global.logger.info(`PUT /account - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
})

router.patch("/updateBalance", async function(req, res, next){
    try {
        const account = req.body;

        const data = JSON.parse(await readFile(global.fileName));
        const index = data.accounts.findIndex(a => a.id === account.id);

        data.accounts[index].balance = account.balance;

        await writeFile(global.fileName, JSON.stringify(data));
    
        res.send(data.accounts[index]);
        global.logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
})

router.use((err, req, res, next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({error: err.message});
})

export default router;