const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
         messagem: 'Usando get dentro da rota de gravação'
    });
});



router.post('/', (req, res, next) => {
    res.status(201).send({
        menssagem: 'Usando post dentro da rota de gravação'
    });
});

router.get('/:id_gravacao', (req, res, next) => {
    const id = req.params.id_gravacao 

      if(id > 0)
      {
        res.status(200).send({
            menssagem: 'Usando o get gravação exclusiva',
            id: id
        });
      }
      else{
        res.status(400).send({
            error: 'Bad Request',
            mensagem: 'Informe um id válido, o ID deve ser um valor númerico maior que 0'
        });
      }
       
});
module.exports = router;