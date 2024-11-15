require('dotenv').config();
const express= require('express');
const { v4: uuidv4 } = require('uuid');
const cors= require('cors');
const app= express();
const QueryString = require("querystring");
const path= require('path');
const srouter = require('./routes/spotifyroutes');
const yrouter = require('./routes/youtubeRouter');
const getCookies = require('./routes/getCookies');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.set("view engine","ejs"); //view-engine nhi hota hai madarjaat
app.set("views", path.resolve("./views")); 

const PORT= 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('/spotify', srouter);

app.use('/youtube', yrouter);

app.use('/cookies', getCookies)

app.get('/', (req,res)=>{
    res.render('index');
})

app.listen(PORT, ()=>{console.log(`server is running on port: ${PORT}`)});