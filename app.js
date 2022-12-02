const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');

const rotaCliente = require('./routes/cliente');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

app.use('/cliente', rotaCliente);

// tratamentro de erros
app.use((req, res, next) => {
    const erro = new Error('Não encontrado...');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send(
        {
            erro: {
                message: error.message
            }
        }
    );
});

module.exports = app