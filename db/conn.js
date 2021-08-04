const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/shopkaro",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
  console.log("connection fulfilled");
}).catch((err)=>{
  console.log(err);
});