require('dotenv').config();
const express= require('express');
const { v4: uuidv4 } = require('uuid');
const cors= require('cors');
const app= express();
const QueryString = require("querystring");
const path= require('path');
const srouter = require('./routes/spotifyroutes');
const yrouter = require('./routes/youtubeRouter');

app.set("view engine","ejs"); //view-engine nhi hota hai madarjaat
app.set("views", path.resolve("./views")); 

const PORT= 3000;
app.use(cors({
    origin: "*",
}))

app.use('/spotify', srouter);

app.use('/youtube', yrouter);

app.get('/', (req,res)=>{
    res.render('index');
})

app.listen(PORT, ()=>{console.log(`server is running on port: ${PORT}`)});