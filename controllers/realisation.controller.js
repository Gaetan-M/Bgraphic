
const Realisation = require('../models/realisation.model.js');

const Service = require('../models/service.model.js');
require('dotenv').config();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const path=require('path')
const cloudinary = require("cloudinary").v2;
cloudinary.config({
	cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
	api_key:process.env.CLOUDINARY_API_KEY,
	api_secret:process.env.CLOUDINARY_API_SECRET
})
// Mongo URI
const mongoURI = process.env.MONGO_URI;
// Create mongo connection
const conn = mongoose.createConnection(mongoURI,{ useUnifiedTopology: true ,useNewUrlParser: true});
// Init gf
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);  
  gfs.collection('Images');
});

module.exports.createRealisation=(req,res,next)=>{

	let results=[];
	let result;
	req.files.map(async(file)=>{
		result=await cloudinary.uploader.upload(file.path)
		results.push(result)
	})
   setTimeout(() => {
	console.log(results) 
	const realisation= new Realisation({
		...req.body,imageUrls:results
	})
	realisation.save()

	.then(async realisation =>{
	Service.updateOne({_id:req.body.id},{
		$push:{
			realisations:realisation._id
		}
	})
	.then(result=>{console.log(result)
		res.status(200).json({
			message:'realisation succesfully created',
			realisation:realisation
	})})
	.catch(error=>console.log(error))
	})
	.catch(error=>{
		res.status(400).json({error})
		console.log(error)
	}) 
   }, 5000);
}

module.exports.addImageRealisation=(req,res,next)=>{
	let index=req.files.length

	for (let i = 0; i < req.files.length; i++) {
		
		
	}
	let results=[];
	let result;
	req.files.map(async(file)=>{
		result=await cloudinary.uploader.upload(file.path)
		results.push(result)
	})
   setTimeout(() => {
	console.log(results) 
	Realisation.updateOne({_id:req.params.id},{
		$push:{
			imageUrls:{
				$each:results
			}
		}
	})
	.then(realisation=>{
		res.status(200).json({
			message:'images succesfully added to realisation',
			realisation:realisation
	})
	})
	.catch(error=>{
		res.status(400).json({error})
		console.log(error)
	}) 
   }, 10000);
}
module.exports.deleteRealisationImage=(req,res,next)=>{

	Realisation.updateOne({_id:req.params.id},{$pull:{imageUrls:{public_id:req.params.idImg}}})
	.then(realisation=>
		{
			cloudinary.uploader.destroy(req.params.idImg, function(error,result) {
				res.status(200).json(realisation)
			console.log(result, error) });
		})
	.catch(console.log)
}

module.exports.getAllRealisations=(req,res,next)=>{
	Realisation.find()
	.populate('service')
	.then(realisation=>res.status(200).json({realisations:realisation}))
	.catch(error=>{
		console.log('realisations find error : ',error);
		res.status(500).json({message:error.message});
	})
}
module.exports.getOneRealisation=(req,res,next)=>{
	Realisation.find({_id:req.params.id})
	.populate('service')
	.then(realisation=>res.status(200).json({realisations:realisation}))
	.catch(error=>{
		console.log('realisations find error : ',error);
		res.status(500).json({message:error.message});
	})
}

module.exports.deleteRealisation=(req,res,next)=>{
	let id=req.params.id
	Realisation.findOneAndDelete({_id:id})
	.then(realisation=>{
		Service.updateOne({_id:req.body.idService},{
			$pull:{
				realisation:id
			}
		})
		.then(result=>{
			res.status(200).json({message:`realisation ${realisation.name} account was delete successfully !`})
		})
		.catch(error=>console.log(error))
	})
	.catch(error=>{
		console.log('error when trying to delete realisation ',error);
		res.status(500).json({message:error.message});
	})
}
module.exports.updateRealisation=(req,res,next)=>{
	let id=req.params.id
	Realisation.findOneAndUpdate({_id:id},{...req.body})
	.then(realisation=>res.status(200).json({message:`realisation ${realisation.name} account was update successfully !`}))
	.catch(error=>{
		console.log('error when trying to ypdate realisation ',error);
		res.status(500).json({message:error.message});
	})
}

module.exports.getWorksServices=(req,res,next)=>{
	console.log('hello')
	Service.find()
	//.populate('service')
	.then(services=>{
		console.log(services)
		Realisation.find()
		.then(realisations=>{
			services.map(service=>{

			})
		})
		/*
		const service = realisations.service
		result = realisations.reduce(function (r, a) {
			r[a.service] = r[a.service] || [];
			r[a.service].push(a);
			return r;
		},Object.create(null))
		console.log(result)
		*/
		res.status(200).json(result)
	})	
	.catch(error=>{
		console.log('error when trying to ypdate service ',error);
		res.status(500).json({message:error.message});
	})
}