const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// retorna todos os produtos
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            'SELECT * FROM tb_cliente',
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        status: res.statusCode
                    });
                }

                const response = {
                    quantidade: result.length,
                    clientes: result.map(cliente => {
                        return {
                            id_cliente: cliente.id_cliente,
                            nome: cliente.nome_cliente,
                            idade: cliente.idade_cliente,
                            cpf: cliente.cpf_cliente,
                            cidade: cliente.cidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes do cliente',
                                url: 'http://localhost:3000/cliente/' + cliente.id_cliente,
                                status: res.statusCode
                            }
                        }
                    })
                };
                return res.status(200).send(response);
            }
        );
    });
});


// usa o :<alguma coisa> para passar um parâmentro
router.get('/:id_cliente', (req, res, next) => {

    const id = req.params.id_cliente;

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query('SELECT * FROM tb_cliente WHERE id_cliente = ?',
            [id],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        status: res.statusCode
                    });
                }

                if (result.length == 0) return (
                    res.status(404).send({
                        message: "O Cliente não foi encontrado"
                    }
                    )
                );

                const response = {
                    message: "Cliente selecionado com sucesso!",
                    cliente: {
                        id_cliente: result[0].id_cliente,
                        nome: result[0].nome_cliente,
                        idade: result[0].idade_cliente,
                        cpf: result[0].cpf_cliente,
                        cidade: result[0].cidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os clientes',
                            url: 'http://localhost:3000/cliente/',
                            status: res.statusCode
                        }
                    }
                }
                return (res.status(200).send({ response }));
            }
        );
    });
});

// insere cliente
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            'INSERT INTO tb_cliente (nome_cliente, idade_cliente, cpf_cliente, cidade) VALUES (?,?,?,?)',
            [req.body.nome, req.body.idade, req.body.cpf, req.body.cidade],
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        status: res.statusCode
                    });
                }

                const response = {
                    message: "Cliente cadastrado com sucesso",
                    clienteCriado: {
                        id_cliete: result.id_cliete,
                        nome: req.body.nome,
                        request: {
                            tipo: 'POST',
                            descricao: 'Return the product created',
                            url: 'http://localhost:3000/cliente/',
                            status: res.statusCode
                        }
                    }
                }
                return (res.status(201).send({ response }));
            }
        );
    });
});

// atualiza cliente
router.patch('/:id_cliente', (req, res, next) => {
    const id = req.params.id_cliente;
    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            'UPDATE tb_cliente set nome_cliente = ?, idade_cliente = ?, cpf_cliente = ?, cidade = ? where id_cliente = ?',
            [req.body.nome, req.body.idade, req.body.cpf, req.body.cidade, id],
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        status: res.statusCode
                    });
                }

                const response = {
                    message: "Cliente atualizado com sucesso",
                    clienteAtualizado: {
                        id_cliete: result.id_cliete,
                        nome: req.body.nome,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna o cliente atualizado',
                            url: 'http://localhost:3000/cliente/',
                            status: res.statusCode
                        }
                    }
                }
                return (res.status(201).send({ response }));
            }
        );
    });
});

// deleta cliente
router.delete('/:id_cliente', (req, res, next) => {
    const id = req.params.id_cliente;
    mysql.getConnection((error, conn) => {

        if (error) return res.status(500).send({ error: error });

        conn.query(
            'DELETE FROM tb_cliente where id_cliente = ?',
            [id],
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        status: res.statusCode
                    });
                }

                const response = {
                    message: "Cliente Deletado com sucesso",
                    clienteDeleteado: {
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna o todos os clientes',
                            url: 'http://localhost:3000/cliente/',
                            status: res.statusCode
                        }
                    }
                }
                return (res.status(201).send({ response }));
            }
        );

    });
});



module.exports = router;