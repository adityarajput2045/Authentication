//This is the oldest version of the code that was commented out. It was replaced with a newer version that uses async/await syntax for connecting to MongoDB using Mongoose. The new version also includes error handling and logs the connection status to the console.
// import e from "express";
// import mongoose from "mongoose";

// const MONGODB_URL = "url"

// const connectDB = async () =>{
//     try {
//         await mongoose.connect(MONGODB_URL,{
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         })
//         console.log("MongoDB connected")
//     } catch (error) {
//         console.error("MongoDB connection failed", error)
//         process.exit(1)
//     }

// }
// export default connectDB;


//This is the updated version of the code that uses async/await syntax for connecting to MongoDB using Mongoose. It includes error handling and logs the connection status to the console.

import mongoose from "mongoose";

const MONGODB_URL = "your_mongodb_connection_string";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;