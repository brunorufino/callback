const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


router.get('/', (req, res, next) => {

   mysql.getConnection((error, conn) => {
       if(error){ return res.status(500).send({error: error})}
       conn.query(
           'SELECT * FROM timegroups_details',
           
           (error, resultado, fields) => {
             if(error){ return res.status(500).send({error: error})}
             return res.status(200).send({response : resultado})
           }
       )
   })
});



router.post('/', (req, res, next) => {

    const ligacao = {
        id: req.body.id,
        timegroupid: req.body.timegroupid,
        time: req.body.time
    };

    if(ligacao.id > 0)
    {
        if(ligacao.timegroupid > 0)
        {
            mysql.getConnection((error, conn) =>{
                conn.query(
                    'INSERT INTO timegroups_details (id, timegroupid, time) VALUES (?,?,?)',
                    [req.body.id, req.body.timegroupid,req.body.time],
                    (error, resultado, field) =>{
                        conn.release();
    
                        if(error)
                        {
                            res.status(500).send({
                                error: error,
                                response:null
                            });
                        }
                        res.status(201).send({
                            menssagem: 'Time inserido com sucesso',
                            ligacao: ligacao,
                            status: 'SUCCESS'
                        })
                    }
                )
    
            })
        }
        else{
            res.status(400).send({
                error: 'Bad  Request ',
                message: "Informe um  timegroupid válido",
                status: '400'
            })
        }
      
    }
    else
    {
        res.status(400).send({
            error: 'Bad  Request ',
            message: "Informe um id válido",
            status: '400'
        })
    }
       
});

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM timegroups_details WHERE id = ?;',
             [req.params.id],
            (error, resultado, fields) => {
              if(error){ return res.status(500).send({error: error})}
              return res.status(200).send({response : resultado})
            }
        )
    })
       
});
module.exports = router;