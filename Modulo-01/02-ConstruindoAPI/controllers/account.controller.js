import accountService from '../services/account.service.js';

global.fileName = "accounts.json";

async function createAccount(req, res, next) {
    try {
        let account = req.body;

        if (!account.name || account.balance == null) {
            throw new Error("Name e Balance são obrigatórios. ");
        }

        account = await accountService.createAccount(account);
        res.send(account);
        global.logger.info(`POST /account - ${JSON.stringify(account)}`);
    } catch (error) {
        next(err);
    }
}

async function getAccounts(req, res, next) {
    try {
        res.send(await accountService.getAccounts());
        global.logger.info(`GET /account`);
    } catch (err) {
        next(err);
    }
}

async function getAccount(req, res, next) {
    try {
        const account = await accountService.getAccount(req.params.id);

        if (account === undefined) {
            res.send(`${req.params.id} não existe na base de dados.`);
            global.logger.info(`GET /account/:id - ${req.params.id}`);
        } else {
            res.send(account);
            global.logger.info(`GET /account/:id - ${req.params.id}`);
        }

    } catch (err) {
        next(err);
    }
}

async function deleteAccount(req, res, next) {
    try {
        await accountService.deleteAccount(req.params.id);

        res.sendStatus(200);
        global.logger.info(`DELETE /account/:id - ${req.params.id}`);
    } catch (err) {
        next(err);
    }
}

async function updateAccount(req, res, next) {
    try {
        const account = req.body;
        const data = await accountService.updateAccount(account);
        res.send(data);
        global.logger.info(`PUT /account - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
}

async function updateBalance(req, res, next) {
    try {
        const account = req.body;
        const data = await accountService.updateBalance(account);
        res.send(data);
        global.logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
}

export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateAccount,
    updateBalance
}