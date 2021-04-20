'use strict'
const validator = require ('validator');
const fs =require('fs')
let Article = require ('../models/article');
const path = require('path');
let controller = {
    
    pruebas: (req, res)=>{
        let saludo = req.body.saludo
        return res.status(200).send({
            blog:'primer blog',
            autor: 'Matias Chicote',
            saludo

        });
    },
    test : (req,res)=>{
        return res.status(200).send({
            message:'test'
        });
    },
    save : (req,res)=>{
        //recoger parametros por post
        let params =req.body;
       
        // validar datos
        try {
            var validate_title =!validator.isEmpty(params.title);
            var validate_content =!validator.isEmpty(params.content);
        } catch (err) {
            return res.status(404).send({
                mensaje:'faltan datos'
            })
        }
        if (validate_title && validate_content){
            //Crear un objeto a guardar
            let article = new Article();
            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;


            // guardar articulos 
            article.save((err,articleStored)=>{
                if (err||!articleStored) {
                    return res.status(404).send({
                        status:'error',
                        mensaje :' el articulo no se ha guardado'
                    });
                }
            //emitir respuesta
                    return res.status(200).send({
                        status:'success',
                        article:articleStored
                    });
            });


        }else{
            return res.status(404).send({
                status:'error',
                mensaje :' el articulo no se ha guardado'
            });
        }
        
       
       
       


    },
    getArticles: (req, res)=>{

        let query = Article.find({});
        let last =req.params.last;

        if (last|| last!=undefined) {
            query.limit(2);
        }
        //FIND
        query.sort('-_id').exec((err,articles)=>{
            if (err) {
                return res.status(500).send({
                    status:'error',
                    message:'Error al devolver articulos'
                    
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status:'error',
                    message:'No hay articulos'
                    
                });
            }


            return res.status(200).send({
                message:'Success',
                articles
            });
        })


    },
    getArticle: (req, res)=>{
    //Recoger id de url
    let articleId =req.params.id;
    // Comprobar que existe
        if (!articleId || articleId ==null) {
            return res.status(404).send({
                status:'error',
                mensaje:'no existe el articulo en el servidor'
            });
        }
    // Buscar articulo
        Article.findById(articleId,(err,article)=>{

            if (err||!article) {
                return res.status(404).send({
                    status:'error',
                    mensaje:'no existe el articulo'
                });
            }
            //Devolver Json
            return res.status(200).send({
                status:'success',
                article
            });
        });

    },
    update : (req, res) => { 
        // Recoger id de url
        let articleId = req.params.id;
        // Recojer datos recibidos por put
        let params = req.body
        //Validar datos 
        try {
            var validate_title =!validator.isEmpty(params.title);
            var validate_content =!validator.isEmpty(params.content);
        } catch (err) {
            return res.status(404).send({
                status:'error',
                mensaje:"Faltan datos para enviar "
            });
        }
        if (validate_title || validate_content) {
        //BUSCAR ARTICULO 
        Article.findOneAndUpdate({_id: articleId},params, {new : true},(err,articleUpdated)=>{
            if(err){
                return res.status(500).send({
                    status:'error',
                    mensaje:"no se puede actualizar"
                });
            }
            if (!articleUpdated) {
                return res.status(404).send({
                    status:'error',
                    mensaje:"no existe el articulo"
                });
            }
            return res.status(200).send({
                status:'success',
                articleUpdated
            });
        })

        }else{
            return res.status(404).send({
                status:'error',
                mensaje:"Faltan datos para enviar "
            });
        }
    },
    delete: (req, res)=>{
    //Recoger id de url
        let articleId =req.params.id;
    //buscar y borrar
    Article.findOneAndDelete({_id: articleId}, (err,articleDeleted)=>{
        if (err) {
            return res.status(500).send({
                status:'error',
                mensaje:'error al borrar'
            })
        }
        if (!articleDeleted) {
            return res.status(404).send({
                status:'error',
                mensaje:'no se encontro elemento, posiblemente no exista '
            })
        }

        return res.status(200).send({
            status:'succes',
            article: articleDeleted
        })
    })
    },
    upload: (req,res)=>{
       
        // recoger fichero
        let file_name = 'imagen no cargada';
        if (!req.files){
            return res.status(404).send({
                status:'error',
                mensaje: file_name
            });
        }

        let file_path =req.files.imagen.path;
        let file_split = file_path.split('/');
        //Nombre del archivo
        let files_name =file_split[2];

        //Extension split
        let Extension_split = files_name.split('\.')
        let file_ext =Extension_split[1];

        //Comprobar si la extension es valida
        if (file_ext != 'png' && file_ext != 'jpg'&& file_ext !='gif' && file_ext != 'jepg') {
            fs.unlink(file_path, (err)=>{
                return res.status(200).send({
                    status:'error',
                    mensaje: 'la extension no es valida'
                })
            })
        }else{
            //obtener id
            let articleId =req.params.id;

            //Bucar articulo
            Article.findOneAndUpdate({_id: articleId},{image: file_name},{new: true},(err,articleUpdated)=>{
                if(err||!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        mensaje:'error al guardar imagen'
                    })
                }
                
                
                return res.status(200).send({
                    status:'succes',
                    article: articleUpdated
                })
            })

            return res.status(404).send({
                status:'error',
                mensaje: file_split,
                file_ext
            })
        }


    },
    getImage: (req, res) =>{
        let file =req.params.image;
        let path_file ='./upload/articles/'+file;
        fs.stat(path_file, function(err, stat) {
            if (err){
                return res.status(404).send({
                    status:'error',
                    mensaje :' no se pudo encontrar imagen'
                });
            }else{
                return res.sendFile(path.resolve(path_file))
            }
        })
    },
    search : (req, res)=>{
        let searchString=req.params.search;
        Article.find({
            "$or":[{
                "title":{"$regex":searchString, "$options":"i"}},
               { "content":{"$regex":searchString, "$options":"i"}}
            ]})
            .sort([['date','descending']])
            .exec((err,articles)=>{
                if (!articles){
                    return res.status(500).send({
                        status:'error',
                        mensaje:'error peticion '
                    })
                }
                if (err) {
                    return res.status(404).send({
                        status:'error',
                        mensaje:'no hay articulos acordes a tu busqueda'
                    })
                }
                return res.status(200).send({
                    status:'success',
                    articulo: articles
                })
            })
    }
    
    
};

module.exports = controller;