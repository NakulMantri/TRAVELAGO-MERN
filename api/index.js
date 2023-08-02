const express=require('express');

const cors =require('cors');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const User=require('./models/User')
require('dotenv').config();
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const imageDownloader=require('image-downloader');
const fs = require('fs');
const multer=require('multer');
const path=require('path');
const Booking=require('./models/Booking');
const Place=require("./models/Place");
const { resolve } = require('path/posix');


const app = express();





const Salt=bcrypt.genSaltSync(10);
const jwtSecret='bsdchbhfhbjbvjsd5545';



app.use(express.json());
app.use(cookieParser());

app.use('/uploads',express.static(path.join(__dirname , 'uploads')));


//api\uploads//
//api\uploads//
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}));  {/*cors is a function to connect port 4000 to our frontend port*/}

mongoose.connect(process.env.MONGO_URL); //monogdb url//
app.get("/",(req,res)=>
{
    res.json('text ok')
});



function getUserDatafromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        })


    })
}






// Register route
app.post("/register", async (req, res) => {
    try {
        const { name, email, number, password } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(409)
                .json({
                    success: false,
                    message:
                        "User already exists. Please login or register with a different email",
                });
        }

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        const newUser = new User({
            name,
            email,
            number,
            password: hashedPassword,
        });
        await newUser.save();



        res.json({ success: true, message: "Registration successful" });
    } catch (error) {
        console.error("Registration failed:", error);
        res
            .status(500)
            .json({ success: false, message: "Registration failed. Please try again later." });
    }
});






app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDoc = await User.findOne({ email });

        if (userDoc) {
            const passOk = await bcrypt.compare(password, userDoc.password);

            if (passOk) {
                const token = jwt.sign(
                    {
                        email: userDoc.email,
                        id: userDoc._id,
                    },
                    jwtSecret,
                    {}
                );
                res.cookie('token', token).json(userDoc);
            } else {
                res.status(422).json('Incorrect password');
            }
        } else {
            res.status(404).json('User not found, register first');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error');
    }
});


app.get('/profile',(req,res)=>
{
const {token}=req.cookies;//creation of users//
if(token){
jwt.verify(token,jwtSecret,{},async(err,userData)=>{
    if(err) throw err;
    const {name,email,_id}= await User.findById(userData.id);
    res.json({name,email,_id});

});
}else{
    res.json(null);
}
    
})


app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
})

app.post('/upload-by-link',async(req,res)=>
{
    const {link}=req.body;
    const newName='photo'+ Date.now() + '.jpg';
    await imageDownloader.image({
        url:link,
        dest: __dirname + '/uploads/'+ newName,
        
    });
    res.json(newName);
    
 
});


const photosMiddleware=multer({dest:'uploads/'});


app.post('/upload', photosMiddleware.array('photos',100),(req,res)=>//this is done to change extension of a piuc in upload button//
{
const uploadedFiles=[];
for(let i=0; i<req.files.length;i++)
{
  const {path,originalname}=req.files[i];
   const parts= originalname.split('.');
   const ext = parts[parts.length-1];
  const newPath=path+'.'+ext;
  
  fs.renameSync(path,newPath);
  uploadedFiles.push(newPath.replace('uploads',''));//replacing uploads/ with empty string//
    }
res.json(uploadedFiles);
});



app.post('/places',(req,res)=>
{
    const { token } = req.cookies;
    const { title, address,description,addedPhotos,perks,extra,checkIn,checkOut,maxGuests,price,}=req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
       const placeDoc = await Place.create({
owner:userData.id,
           title, address, description, photos:addedPhotos, perks, extra, checkIn, checkOut, maxGuests,price,
    });
    res.json(placeDoc);
});
})



app.get('/user-places',(req,res)=>
{
    const {token}=req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {//verify user//
    
    const {id}=userData;
    res.json( await Place.find({owner:id}) );
    
    
    });

});

app.get('/places/:id',async (req,res)=>
{
    const {id}=req.params;
    res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
   
    const { token } = req.cookies;
    const { id,title, address, description,addedPhotos, perks, extra, checkIn, checkOut, maxGuests,price, } = req.body;
   
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const placeDoc = await Place.findById(id);
if(userData.id === placeDoc.owner.toString()){
    placeDoc.set({
        title, address, description, //to add photos as photos because it's mentioned as "photos" in schema//
        photos:addedPhotos, perks, extra, checkIn, checkOut, maxGuests,price,

    });
    await placeDoc.save();
    res.json('ok');
    
}

    })
});


app.get('/places',async (req,res)=>{
    res.json(await Place.find())
})



app.post('/bookings',async(req,res)=>
{
    const userData = await getUserDatafromReq(req);
    const { place, checkIn, checkOut,numberOfGuests, name, email,phone,price,}=req.body;


 Booking.create({
    place,user:userData.id,
     checkIn, checkOut, numberOfGuests, name,email ,phone, price,
}).then((doc)=>{
    
    res.json(doc);
}).catch((err)=>{
    throw err;
})



})





app.get('/bookings',async (req,res)=>{
  const userData= await getUserDatafromReq(req);
  res.json(await Booking.find({user:userData.id}).populate('place'))//populate is used to make place id to place object//

})


app.listen(4000,function()
{
    console.log("Server running at port 4000.")
});
