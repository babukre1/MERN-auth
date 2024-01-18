import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const app = express();
dotenv.config();
console.log(process.env.MONGO);
mongoose.connect(process.env.MONGO)
.then((res) => {
    console.log("connected to mongoDB");
}).catch((err) => console.log("didnt connected: ", err))


app.get("/hello", (req, res) => {
    console.log("hello, world");
    res.send("this is hi");

})

app.listen(3004, () => {
  console.log("server listening in port 3000");
});
