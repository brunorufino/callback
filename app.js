const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');


const rotaLigacao = require('./routes/ligacao');
const rotaGravacao = require('./routes/gravacao');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

app.use((req, res, next )=> {
    res.header('Acces-Control-Allow-Origin', '*');   //permite acesso para todos domain
    res.header(
        'Acces-Control-Allow-Header', 
        'Origin', 'X-Requested-With', 'Accept', 'Authorization','Content-Type'
    );
    
    if(req.method === 'OPTIONS'){
        res.header('Acces-Control-Allow-Methods', 'POST','PATCH','DELETE','GET');
        return res.status(200).send({});
    }
    next();
})


app.use('/ligacao', rotaLigacao);
app.use('/gravacao', rotaGravacao);

app.use((req, res, next) => {
    res.status(404).send({
        mensagem: 'Nao foi possivel encontrar essa rota'
    });
});


module.exports = app;