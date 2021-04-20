'use strict'

const express = require ('express');
const ArticleController = require('../controllers/article');
let router = express.Router();


const multiparty  = require('connect-multiparty');
let md_upload = multiparty({ uploadDir:'./upload/articles'})

// Rutas de prueba
router.get('/test', ArticleController.test);
router.post('/saludo', ArticleController.pruebas);


// Rutas de articulos
router.post('/save', ArticleController.save)
router.get('/articles/:last?', ArticleController.getArticles)
router.get('/article/:id', ArticleController.getArticle)
router.put('/article/:id', ArticleController.update)
router.delete('/article/:id', ArticleController.delete)
router.post('/new-image/:id', md_upload, ArticleController.upload)
router.get('/image/:image', ArticleController.getImage)

module.exports = router;