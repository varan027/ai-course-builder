import mongoose from "mongoose";

let cached = (global as any).mongoose;

if(!cached){
  cached = (global as any).mongoose = {conn: null, promise: null}
}


const ConnectToDB = async () =>{
  const MONGODB_URI = process.env.MONGO_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if(cached.conn){
    console.log("DB reusing cached connection");
    return cached.conn
  }

  if(!cached.promise){
    const opts = {
      bufferCommands: false
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts)
    .then((mongoose)=>{
      console.log("DB connected : new connection created")
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default ConnectToDB;
