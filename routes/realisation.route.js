const express = require('express');
const Router =express.Router();

const realisation=require('../controllers/realisation.controller.js');
const upload=require('../middlewares/upload.js')


Router.get('/realisations',realisation.getAllRealisations)
Router.get('/realisations/services',realisation.getWorksServices)
Router.get('/realisation/:id',realisation.getOneRealisation)
Router.delete('/realisation/:id',realisation.deleteRealisation)
Router.post('/realisation/create',upload.array("realisations"),realisation.createRealisation)
Router.put('/realisation/image/add/:id',upload.array("realisations"),realisation.addImageRealisation)
Router.put('/realisation/image/delete/:id/:idImg',realisation.deleteRealisationImage)
Router.put('/realisation/update/:id',realisation.updateRealisation)


module.exports=Router;