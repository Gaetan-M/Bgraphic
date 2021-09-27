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
/*
module.exports.createService=(req,res,next)=>{
	console.log(req.files.services);	
	const {name,description,type,contact,moreDescription}=req.body

	const service = new Service({
		...req.body,
	})
	service.save()
	.then(async service =>{
		if (req.files.services===undefined) {
			res.status(200).json({message:'service was created',service:service})
		}else{
			await Service.findOneAndUpdate({_id:service._id},{
				$push:{
					imageUrls:{
						$each:req.files.services.map(image=>
							{
								let url={url:`http://localhost:8080/service/image/${service._id}/${image.filename}`,_id:image.id};
								return url;
							}
						)
					}
				}
			})
			.then(updated=>res.status(200).json({message:'service was created',service:updated}))
			.then(error=>res.status(404).json({message:'service does not exist'}))
	    }
	})
	.catch(error=>{
		res.status(500).json({message:'error ! service not created'});
		console.log('service',error);
	})
}
*/
module.exports.createService1=(req,res,next)=>{
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
	const service= new Service({
		...req.body,imageUrls:results
	})
	service.save()

	.then(service=>{
		res.status(200).json({
			message:'service succesfully created',
			service:service
	})
	})
	.catch(error=>{
		res.status(400).json({error})
		console.log(error)
	}) 
   }, 10000);
}
/*
module.exports.updateServiceImage=(req,res,next)=>{
	let id=req.params.id
	console.log(req.files.services)
	Service.updateOne({_id:id},{
		$push:{
			imageUrls:{
				$each:req.files.services.map(service=>
					{
						let url={url:`http://localhost:8080/service/image/${id}/${service.filename}`,_id:service.id};
						return url;
					}
				)
			}
		}
	})
	.then(user=>res.status(200).json({message:`service Image of ${user.fullname} was updated`}))
	.then(error=>res.status(404).json({message:'service does not exist'}))
}
 function getID (id){
	 return id;
}
*/
module.exports.addImageService=(req,res,next)=>{
	let index=req.files.length
	let results=[];
	let result;
	req.files.map(async(file)=>{
		result=await cloudinary.uploader.upload(file.path)
		results.push(result)
	})
   setTimeout(() => {
	console.log(results) 
	Service.updateOne({_id:req.params.id},{
		$push:{
			imageUrls:{
				$each:results
			}
		}
	})
	.then(service=>{
		res.status(200).json({
			message:'images succesfully added to service',
			service:service
	})
	})
	.catch(error=>{
		res.status(400).json({error})
		console.log(error)
	}) 
   }, 10000);
}
module.exports.deleteServiceImage=(req,res,next)=>{

	Service.updateOne({_id:req.params.id},{$pull:{imageUrls:{public_id:req.params.idImg}}})
	.then(service=>
		{
			cloudinary.uploader.destroy(req.params.idImg, function(error,result) {
				res.status(200).json(service)
			console.log(result, error) });
		})
	.catch(console.log)
}
/*
module.exports.addServiceRealisation=(req,res,next)=>{
	let id=req.params.id
	console.log(req.files.realisations)
	Service.findOneAndUpdate({_id:id},{
		$push:{
			realisations:{
				...req.body,
				$push:{
					imageUrls:{
						$each:req.files.realisations.map(realisation=>
							{
								let url={url:`http://localhost:8080/service/realisation/image/${id}/${realisation.filename}`,_id:realisation.id};
								return url;
							}
						)
					}
				}
			}
		}
	})
	.then(service=>res.status(200).json({message:`service realisation of ${service.name} was updated`,service:service}))
	.then(error=>res.status(404).json({message:'service does not exist'}))
}
*/
module.exports.getAllServices=(req,res,next)=>{
	Service.find()
	.populate('realisations')
	.then(service=>res.status(200).json({services:service}))
	.catch(error=>{
		console.log('services find error : ',error);
		res.status(500).json({message:error.message});
	})
}
module.exports.getOneService=(req,res,next)=>{
	Service.find({_id:req.params.id})
	.then(service=>res.status(200).json({services:service}))
	.catch(error=>{
		console.log('services find error : ',error);
		res.status(500).json({message:error.message});
	})
}
module.exports.getServiceImage=async (req,res,next)=>{
	let filename=getID(req.params.filename)
	console.log(filename);
	gfs.files.findOne({filename:filename},(err,file)=>{
		console.log(file)
		// check if image exist
		if (!file || file.length ===0) {
			return res.status(404).json({message:'this service image does not exist'})
		}
		const readstream = gfs.createReadStream(file.filename);
      	return readstream.pipe(res);
	})
}

module.exports.deleteService=(req,res,next)=>{
	let id=req.params.id
	Service.findOneAndDelete({_id:id})
	.then(service=>res.status(200).json({message:`service ${service.name} account was delete successfully !`}))
	.catch(error=>{
		console.log('error when trying to delete service ',error);
		res.status(500).json({message:error.message});
	})
}
/*
module.exports.deleteServiceImage=(req,res,next)=>{
	let id=req.params.id
	let filename=req.params.filename;
	Service.updateOne({_id:id},{
		$pull:{
			imageUrls:{url:`http://localhost:8080/service/image/${id}/${filename}`}
		}
	})
	.then(service=>{
		// Service.deleteOne({_id:id})
		console.log(service)
		res.status(200).json({message:`service ${service.name} account was delete successfully !`})
	})
	.catch(error=>{
		console.log('error when trying to delete service ',error);
		res.status(500).json({message:error.message});
	})
}
*/
module.exports.updateService=(req,res,next)=>{
	let id=req.params.id
	Service.findOneAndUpdate({_id:id},{...req.body})
	.then(service=>res.status(200).json({message:`service ${service.name} account was update successfully !`}))
	.catch(error=>{
		console.log('error when trying to ypdate service ',error);
		res.status(500).json({message:error.message});
	})
}

