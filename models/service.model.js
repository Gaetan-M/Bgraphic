const mongoose =require('mongoose');


const serviceSchema=mongoose.Schema({
	name:{type:String,required:true},
	description:String,
	moreDescription:String,
	type:String,
	contact:String,
	imageUrls:[{}],
	realisations:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Realisation'
	}]
})

module.exports=mongoose.model('Service',serviceSchema);