const {Router}= require('express');
const router= Router();
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const QueryString = require("querystring");
const path= require('path');



router.route("/login").get((req,res)=>{
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
        show_dialog:"true",
    })
    res.json(spotify_url);
})
// app.get("/spotify", (req,res)=>{
//     console.log("here");
    
//     const client_id=process.env.SPOTIFY_CLIENT_ID;
    
//     const redirect_uri=process.env.SPOTIFY_REDIRECT_URI;

    
//     const scope= "user-read-private user-read-email user-library-read user-top-read";
//     const state= uuidv4();
//     const spotify_url= "https://accounts.spotify.com/authorize?"+QueryString.stringify({
//         response_type: "code", //what is this, remember to learn this type
//         client_id: client_id,
//         scope: scope,
//         redirect_uri: redirect_uri,
//         state: state,
//         show_dialog:"true",
//     })
//     res.json(spotify_url);
// })
router.route("/getToken").get(async (req,res)=>{
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

    res.cookie("Spotify_access_token", tokenData.access_token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60,  // maxAge is in milliseconds
    });
    // return res
    return res.redirect("http://localhost:5173");

    // console.log(tokenData);
})
// app.get("/spotify/getToken", async(req, res) => {
//     const client_id = process.env.SPOTIFY_CLIENT_ID;
//     const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
//     const redirect_uri=process.env.SPOTIFY_REDIRECT_URI;
    
//     const code = req.query.code
    
//     const authOptions = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
//         },
//         body: new URLSearchParams({
//             code: code ? code: '',
//             redirect_uri: redirect_uri,
//             grant_type: 'authorization_code',
//         }).toString(),
//     }

//     const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);    
//     const tokenData = await tokenResponse.json();
//     console.log("here4");


//     console.log(tokenData);
// })


module.exports= router;