const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const fileUpload = require("express-fileupload");
const morgan = require('morgan')
const cors = require('cors')
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')
const postRoute = require('./routes/postRoute')
const conversationRoutes = require('./routes/conversationRoute')
const messageRoutes = require('./routes/messageRoutes')
const path = require('path')


const app = express()
dotenv.config();
app.use(express.json({ limit: "200kb" }));
app.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024,
      useTempFiles: true,
      tempFileDir: "/tmp/",
    },
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
// app.use(morgan("common"));

app.use(
  cors({
    origin: "*",
  })
);

mongoose
.connect(process.env.MONGO_URL)
.then(console.log("Connected to MongoDB"))
.catch(err=>console.log(err));


app.use("/images", express.static(path.join(__dirname, "public/images")))
//middleware


app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/conv', conversationRoutes);
app.use('/api/message', messageRoutes);



app.listen(8700, ()=>{
    console.log('backend is running');
})