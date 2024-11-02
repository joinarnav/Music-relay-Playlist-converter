const {Router}= require('express');
const router= Router();
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const QueryString = require("querystring");
const path= require('path');
const {google} = require('googleapis');



router.route('/login').get(async (req,res)=>{
    const scope= ["https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtubepartner"]
    
    const client_id=process.env.YOUTUBE_CLIENT_ID;
    
    const redirect_uri=process.env.YOUTUBE_REDIRECT_URI;
    const client_secret= process.env.YOUTUBE_CLIENT_SECRET;

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scope,
        prompt: 'consent',
    });

    res.status(200).json({authUrl});
    

})

router.route('/youtube/getToken').get(async (req,res)=>{
    
})

module.exports= router;