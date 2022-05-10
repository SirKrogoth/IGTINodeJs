import {
    promises as fs
} from "fs";

const {
    readFile,
    writeFile
} = fs;

async function getAccounts(){
    const data = JSON.parse(await readFile(global.fileName));
    return data.accounts;
}

async function getAccount(id){
    const accounts = await getAccounts();
    const account = accounts.find(account => account.id === parseInt(id));

    return account;
}

async function insertAccount(account){
    const data = JSON.parse(await readFile(global.fileName));
    //Se eu simplesmente criar o ID, ele irá para o final do arquivo, o que pode nao ser interessante
    //Com a abordagem abaixo, trago para cima em destaque o id
    account = {
        id: data.nextId++,
        //...account
        name: account.name,
        balance: account.balance
    }
    //data.nextId++; nao necessário, conforme linha acima. 
    //colocar o ++ depois, significa que primeiro irá implementar e depois acrescentar
    //caso venha antes, ele irá incrementar e depois adicionar o valor do campo

    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    return account;
}

async function deleteAccount(id){
    const data = JSON.parse(await readFile(global.fileName));

    //o filter irá retornar tudo que é diferente de req.params.id
    data.accounts = data.accounts.filter(account => account.id !== parseInt(id));

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
}

async function updateAccount(account){
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(a => a.id === account.id);

    if (index == -1) {
        global.logger.info(`PUT /account - ${JSON.stringify(account)} - Registro não encontrado`);
        throw new Error("Registro não encontrado.");
    } else {
        data.accounts[index] = account;

        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        delete data.nextId;

        return data;
    }
}

async function updateBalance(account){
    let data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(a => a.id === account.id);

    if (index == -1) {
        global.logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)} - Registro não encontrado`);
        throw new Error("Registro não encontrado.");
    } else {
        data.accounts[index].balance = account.balance;

        await writeFile(global.fileName, JSON.stringify(data));

        return data.accounts[index];
    }
}

export default {
    getAccounts,
    insertAccount,
    getAccount,
    deleteAccount,
    updateAccount,
    updateBalance
}