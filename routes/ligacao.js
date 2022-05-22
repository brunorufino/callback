const express = require('express');
const defaults = require('nodemon/lib/config/defaults');
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


router.post('/agentes', (req, res, next) => {

    const ligacao = {
        Data_Inicial: req.body.Data_Inicial,
        Data_Final: req.body.Data_Final,
        tipo: req.body.tipo,
        agente: req.body.agente
    };
            
    var query 
    var tipo = req.body.tipo;
 
    let labrina = ligacao.Data_Inicial.split('-')
    if(ligacao.Data_Inicial != "")
    {   
        if(ligacao.Data_Final != "")
        {
            if(ligacao.Data_tipo != "")
            {
                switch(tipo)
                {
                    case "ANSWERED": query  = "SELECT *  FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"' AND c.disposition = 'ANSWERED' AND c.dstchannel LIKE '%"+ligacao.agente+"%' AND lastapp = 'Queue'"; break;
                    case "BUSY":     query  = "SELECT *  FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"' AND c.disposition = 'BUSY' AND c.dstchannel LIKE '%"+ligacao.agente+"%' AND lastapp = 'Queue'"; break;
                    case "NO ANSWER": query = "SELECT *  FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"' AND c.disposition = 'NO ANSWER' AND c.dstchannel LIKE '%"+ligacao.agente+"%' AND lastapp = 'Queue'"; break;
                    default:  query = "SELECT *  FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"'  AND c.dstchannel LIKE '%"+ligacao.agente+"%' AND lastapp = 'Queue'"; break;
                }
                mysql.getConnection((error, conn) => {
                    if(error){ return res.status(500).send({error: error})}
                    conn.query(
                       query,
                        (error, resultado, fields) => {
                          if(error){ return res.status(500).send({error: error})}
                      
                          const response = {
                                total: resultado.length,
                                ligacoes: resultado.map(lig =>{
                               
                                  return {
                                      codigo_ligacao: lig.clid,
                                      data: lig.calldate ,
                                      origem: lig.src,
                                      tempo: lig.duration,
                                      destino: lig.dst,
                                      request: {
                                          code: '200',
                                          tipo: 'POST',
                                          descricao: 'Detalhes dos Registro das Ligações',
                                          nome_do_arquivo: "/var/spool/asterisk/monitor/"+labrina[0]+"/"+labrina[1]+"/"+labrina[2]+"/"+lig.recordingfile,
                                      }
                                  }
                              })
                          }
                          return res.status(200).send(response);
                        }
                    )
                })
            }
            else{
               
                res.status(400).send({
                    error: 'Bad  Request ',
                    message: "Informe o campo tipo",
                    status: '400'
                })
            }       
        }
        else{
            res.status(400).send({
                error: 'Bad  Request ',
                message: "Informe a Data Final",
                status: '400'
            })
        }
    }
    else
    {
        res.status(400).send({
            error: 'Bad  Request ',
            message: "Informe a data Inicial",
            status: '400'
        })
    }
       
});


router.post('/detalhes', (req, res, next) => {

    const ligacao = {
        Data_Inicial: req.body.Data_Inicial,
        Data_Final: req.body.Data_Final,
        tipo: req.body.tipo
    };
            
    var query 
    var tipo = req.body.tipo;
 
    let labrina = ligacao.Data_Inicial.split('-')
    if(ligacao.Data_Inicial != "")
    {   
        if(ligacao.Data_Final != "")
        {
            if(ligacao.Data_tipo != "")
            {
                switch(tipo)
                {
                    case "ANSWERED": query  = "SELECT *  FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"' AND c.disposition = 'ANSWERED'"; break;
                    case "BUSY":     query  = "SELECT *  FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"' AND c.disposition = 'BUSY'"; break;
                    case "NO ANSWER": query = "SELECT *  FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"' AND c.disposition = 'NO ANSWER'"; break;
                    default:  query = "SELECT * FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"'"; break;
                }
                mysql.getConnection((error, conn) => {
                    if(error){ return res.status(500).send({error: error})}
                    conn.query(
                       query,
                        (error, resultado, fields) => {
                          if(error){ return res.status(500).send({error: error})}
                      
                          const response = {
                                total: resultado.length,
                                ligacoes: resultado.map(lig =>{
                                    
                                  return {
                                      codigo_ligacao: lig.clid,
                                      data: lig.calldate,
                                      origem: lig.src,
                                      destino: lig.dst,
                                      request: {
                                          code: '200',
                                          tipo: 'POST',
                                          descricao: 'Detalhes dos Registro das Ligações',
                                          nome_do_arquivo: "/var/spool/asterisk/monitor/"+labrina[0]+"/"+labrina[1]+"/"+labrina[2]+"/"+lig.recordingfile,
                                      }
                                  }
                              })
                          }
                          return res.status(200).send(response);
                        }
                    )
                })
            }
            else{
               
                res.status(400).send({
                    error: 'Bad  Request ',
                    message: "Informe o campo tipo",
                    status: '400'
                })
            }       
        }
        else{
            res.status(400).send({
                error: 'Bad  Request ',
                message: "Informe a Data Final",
                status: '400'
            })
        }
    }
    else
    {
        res.status(400).send({
            error: 'Bad  Request ',
            message: "Informe a data Inicial",
            status: '400'
        })
    }
       
});


router.post('/total', (req, res, next) => {

    const ligacao = {
        Data_Inicial: req.body.Data_Inicial,
        Data_Final: req.body.Data_Final,
        tipo: req.body.tipo
    };
            
    var query 
    var tipo = req.body.tipo;

    if(ligacao.Data_Inicial != "")
    {   
        if(ligacao.Data_Final != "")
        {
            if(ligacao.Data_tipo != "")
            {
                switch(tipo)
                {
                    case "ANSWERED": query  = "SELECT COUNT(*) AS LIGAÇÕES_ATENDIDAS FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"' AND c.disposition = 'ANSWERED'"; break;
                    case "BUSY":     query  = "SELECT COUNT(*) AS LIGAÇÕES_NÃO_ATENDIDAS FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"' AND c.disposition = 'BUSY'"; break;
                    case "NO ANSWER": query = "SELECT COUNT(*) AS LIGAÇÕES_PERDIDAS FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"' AND c.disposition = 'NO ANSWER'"; break;
                    default:  query = "SELECT COUNT(*) AS TODAS_LIGAÇÕES FROM cdr c WHERE c.calldate BETWEEN '"+ligacao.Data_Inicial +"' AND '"+ligacao.Data_Final+"'"; break;
                }
                mysql.getConnection((error, conn) => {
                    if(error){ return res.status(500).send({error: error})}
                    conn.query(
                       query,
                        (error, resultado, fields) => {
                          if(error){ return res.status(500).send({error: error})}
                          
                          return res.status(200).send({response : resultado})
                        }
                    )
                })
            }
            else{
                res.status(400).send({
                    error: 'Bad  Request ',
                    message: "Informe o campo tipo",
                    status: '400'
                })
            }       
        }
        else{
            res.status(400).send({
                error: 'Bad  Request ',
                message: "Informe a Data Final",
                status: '400'
            })
        }
    }
    else
    {
        res.status(400).send({
            error: 'Bad  Request ',
            message: "Informe a data Inicial",
            status: '400'
        })
    }
       
});

router.get('/:clid', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM cdr WHERE clid = ?;',
             [req.params.clid],
            (error, resultado, fields) => {
              if(error){ return res.status(500).send({error: error})}
              const response = {
                total: resultado.length,
                ligacoes: resultado.map(lig =>{
                    return {
                        
                        codigo_ligacao: lig.clid,
                        origem: lig.src,
                        destino: lig.dst,
                        request: {
                            code: '200',
                            tipo: 'GET',
                            descricao: 'Detalhes dos Registro das Ligações',
                            nome_do_arquivo: lig.recordingfile,
                        }
                    }
                })
            }
              return res.status(200).send({response})
            }
        )
    })
       
});
module.exports = router;