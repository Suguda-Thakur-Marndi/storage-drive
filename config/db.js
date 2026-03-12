import mongoose from 'mongoose';
const connectToDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected");
    }
    catch(error){
        console.log("db error",error);
    }
};
export default connectToDB;