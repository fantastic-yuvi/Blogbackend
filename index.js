import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import  express  from "express";
import  cors  from "cors";
const app=express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://Yuvraj:2001agra@blogapp.jjoj91d.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});
const userSchema= new mongoose.Schema({
    username:String,
    password:String
});

const Collection = new mongoose.model("users",userSchema);
app.post("/authlogin",async(req,res)=>{
    const {username,password}=req.body;
    const userPresent=await Collection.findOne({username});
    if(!userPresent){
        return res.json({message:"User Don't Exist"});
    }
    const passwordCheck=(userPresent.password===password)?true:false;
    if(!passwordCheck){
        return res.json({message:"Username Or Password Invalid"});
    }
    const token = jwt.sign({id:userPresent._id},"secret");
    res.json({token,userID:userPresent._id}); 
    
});
app.post("/authregister",async(req,res)=>{
    const {username,password}=req.body;
    const userPresent= await Collection.findOne({username});
    if(userPresent){
        return res.json({message:"User Already Exist"});
    }
   let user=new Collection();
   user.username=req.body.username;
   user.password=req.body.password;
   await user.save();
    res.json({message:"user registration Success"});
    // let userdetail=new Collection();
    // userdetail.username=req.body.username;
    // userdetail.password=req.body.password;
    // await userdetail.save();
});
const blogschema= new mongoose.Schema({
    title:String,
    blog:String,
    mCode:String
});
const blogdetails = new mongoose.model("blogdata",blogschema);

app.post("/blogdata",async(req,res)=>{
    let blogdata = new blogdetails();
    blogdata.title=req.body.title;
    blogdata.blog=req.body.blog;
    blogdata.mCode=req.body.mCode;
    await blogdata.save(); 
    res.json({message:"user data Success"});

});

app.post("/getdata",async(req,res)=>{
    const data = await blogdetails.find();
    res.json(data);
})

app.listen(3001,()=>{
    console.log("Sever Working Fine");
    
});

