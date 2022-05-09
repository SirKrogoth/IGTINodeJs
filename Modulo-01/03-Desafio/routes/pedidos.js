import express from "express";
import { promises as fs } from "fs";

global.fileName = "pedidos.json";

const {
    readFile,
    writeFile
} = fs;

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let data = JSON.parse(await readFile(global.fileName));
        delete data.nextId;
        res.send(data);
        global.logger.info(`GET /pedidos`);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const pedido = data.pedidos.find(p => p.id === parseInt(req.params.id));

        if(pedido == undefined){
            res.send(`GET /pedidos/:id - ${req.params.id} - Registro não encontrado.`);
            global.logger.info(`GET /pedidos/:id - ${req.params.id} - Registro não encontrado.`)
        }
        else{
            res.send(pedido);
            global.logger.info(`GET /pedidos/:id - ${req.params.id}`);
        }

    } catch (error) {
        next(error);
    }
})

router.post('/valorCliente', async (req, res, next) => {
    try {
        const cliente = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const pedidos = data.pedidos.filter(p => (p.cliente == cliente.cliente) && (p.entregue == true));        
        var total = 0;

        for(var i = 0; i < pedidos.length; i++){
            total = total + pedidos[i].valor;
        }

        res.status(200).send((total).toString());
        global.logger.info(`POST /pedidos/valorCliente - ${ total }`);

    } catch (error) {
        next(error);
    }
});

router.post('/buscarPedidosCliente', async (req, res, next) => {
    try {
        const cliente = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        data.pedidos = data.pedidos.filter(p => (p.cliente == cliente.cliente) && (p.entregue == true));                

        res.status(200).send(data.pedidos);
        global.logger.info(`POST /pedidos/buscarPedidosCliente`)
    } catch (error) {
        next(error);
    }
});

router.post('/valorProduto', async (req, res, next) => {
    try {
        const produto = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const produtos = data.pedidos.filter(p => (p.produto == produto.produto) && (p.entregue == true));        
        var total = 0;

        for(var i = 0; i < produtos.length; i++){
            total = total + produtos[i].valor;
        }

        res.status(200).send((total).toString());
        global.logger.info(`POST /pedidos/valorProduto - ${ total }`);

    } catch (error) {
        next(error);
    }
});

router.post('/buscarPedidosProduto', async (req, res, next) => {
    try {
        const produto = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        data.pedidos = data.pedidos.filter(p => (p.produto == produto.produto) && (p.entregue == true));                

        res.status(200).send(data.pedidos);
        global.logger.info(`POST /pedidos/buscarPedidosCliente`)
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let pedido = req.body;
        const data = JSON.parse(await readFile(global.fileName));

        pedido = {
            id: data.nextId++,
            cliente: pedido.cliente,
            produto: pedido.produto,
            valor: pedido.valor,
            entregue: false,
            timestamp: new Date()
        }

        data.pedidos.push(pedido);

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(pedido);
        global.logger.info(`POST /pedidos`)
    } catch (error) {
        next(error);
    }
});

router.post('/maisVendidos', async (req, res, next) => {
    try {
        const dados = JSON.parse(await readFile(global.fileName));

        
    } catch (error) {
        next(error);
    }
})

router.put('/', async (req, res, next) => {
    try {
        const pedido = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const index = data.pedidos.findIndex(a => a.id === pedido.id);

        if(index == -1){
            global.logger.info(`PUT /pedidos - ${ JSON.stringify(pedido) } - Registro não encontrado`);
            throw new Error("Registro não encontrado.");
        }
        else{
            data.pedidos[index] = pedido;
            await writeFile(global.fileName, JSON.stringify(data, null, 2));
            res.send(pedido);
            global.logger.info(`PUT /pedidos - ${ JSON.stringify(pedido) }`);
        }
    } catch (error) {
        next(error);
    }
});

router.patch('/atualizaEstadoEntrega', async (req, res, next) => {
    try {
        const pedido = req.body;
        const data = JSON.parse(await readFile(global.fileName));
        const index = data.pedidos.findIndex(a => a.id === pedido.id);

        if(index === -1){
            global.logger.info(`PATCH /pedidos/atualizaEstadoEntrega - ${ pedido } - Pedido não encontrado.`);
            throw new Error("Registro não encontrado.");
        }
        else{
            data.pedidos[index].entregue = pedido.entregue;
            
            await writeFile(global.fileName, JSON.stringify(data, null, 2));
            res.send(data.pedidos[index]);
            global.logger.info(`PATCH /pedidos/atualizaEstadoEntrega - ${ JSON.stringify(pedido) }`);
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const index = data.pedidos.findIndex(a => a.id === parseInt(req.params.id));

        if(index == -1){
            global.logger.info(`DELETE /pedidos - ${ pedido } - Registro não encontrado.`);
            throw new Error("Registro não encontrado.");
        }
        else{
            //filter irá retornar tudo que é diferente
            data.pedidos = data.pedidos.filter(p => p.id !== parseInt(req.params.id));

            await writeFile(global.fileName, JSON.stringify(data, null, 2));

            res.send(data);
            global.logger.info(`DELETE /pedidos - ${ parseInt(req.params.id) } - Registro excluído com sucesso.`);
        }
    } catch (error) {
        next(error);
    }
})

//logger
router.use((err, req, res, next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
});

export default router;