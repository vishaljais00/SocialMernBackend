const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')
const postRoute = require('./routes/postRoute')


const app = express()
dotenv.config();
app.use(express.json());
app.use(helmet());
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

//middleware

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);


app.listen(8700, ()=>{
    console.log('backend is running');
})