const mongoose= require('mongoose');



const placeSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    title:String,
    address: String,
    description: String,
    photos:[String],
    perks:[String],
    extra:String,
    checkIn:String,
    checkOut:String,
    maxGuests:Number,
    price:String,
});


const PlaceModel =mongoose.model('Place',placeSchema);


module.exports=PlaceModel;