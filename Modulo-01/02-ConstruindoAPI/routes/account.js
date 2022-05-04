import express from "express";
import {
    promises as fs
} from "fs";

global.fileName = "accounts.json";

const {
    readFile,
    writeFile
} = fs;
const router = express.Router();

router.post('/', async function (req, res) {
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
    } catch (error) {
        res.status(400).send({
            err: error.message
        });
    }
})

router.get('/', async function (req, res) {
    try {
        let data = JSON.parse(await readFile(global.fileName));
        //delete irá remover o campo id na visualização 
        delete data.nextId;
        res.send(data);
    } catch (err) {
        res.status(400).send({
            error: err.message
        });
    }
})

router.get('/:id', async function (req, res) {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const account = data.accounts.find(account => account.id === parseInt(req.params.id));
        if (account === undefined)
            res.send(`${req.params.id} não existe na base de dados.`);
        else
            res.send(account);
    } catch (err) {
        res.status(400).send({
            error: err.message
        })
    }
})

router.delete('/:id', async function (req, res) {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        //o filter irá retornar tudo que é diferente de req.params.id
        data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id));

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        //res.end();
        res.send(`Elemento ${req.params.id} removido com sucesso`);
    } catch (err) {
        res.status(400).send({
            erro: err.message
        });
    }
})
export default router;