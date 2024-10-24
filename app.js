require('dotenv').config();
const express= require('express');
const { v4: uuidv4 } = require('uuid');
const cors= require('cors');
const app= express();
const QueryString = require("querystring");
const path= require('path');

app.set("view engine","ejs"); //view-engine nhi hota hai madarjaat
app.set("views", path.resolve("./views")); 

const PORT= 3000;
app.use(cors({
    origin: "*",
}))
app.get("/spotify", (req,res)=>{
    console.log("here");
    
    const client_id=process.env.SPOTIFY_CLIENT_ID;
    
    const redirect_uri=process.env.SPOTIFY_REDIRECT_URI;

    
    const scope= "user-read-private user-read-email user-library-read user-top-read";
    const state= uuidv4();
    const spotify_url= "https://accounts.spotify.com/authorize?"+QueryString.stringify({
        response_type: "code", //what is this, remember to learn this type
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        show_dialogue:"true",
    })
    res.json(spotify_url);
})

app.get("/spotify/getToken", async(req, res) => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri=process.env.SPOTIFY_REDIRECT_URI;
    
    const code = req.query.code
    
    const authOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
        body: new URLSearchParams({
            code: code ? code: '',
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code',
        }).toString(),
    }

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);    
    const tokenData = await tokenResponse.json();
    console.log("here4");


    console.log(tokenData);
})

app.get('/', (req,res)=>{
    res.render('index');
})

app.listen(PORT, ()=>{console.log(`server is running on port: ${PORT}`)});