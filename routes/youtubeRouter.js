const {Router}= require('express');
const router= Router();
require('dotenv').config();
const {google} = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');



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

router.route('/getToken').get(async (req,res)=>{
    const code = req.query.code
    console.log(code);
    if(!code){
        return res.status(400)
        .json({
            message: "didn't find code"
        })
    }
    
    try {
        const client_id=process.env.YOUTUBE_CLIENT_ID;
        
        const redirect_uri=process.env.YOUTUBE_REDIRECT_URI;
        const client_secret= process.env.YOUTUBE_CLIENT_SECRET;
    
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
        
        const { tokens } = await oAuth2Client.getToken(code)
        console.log(tokens);
    
        if(tokens && tokens.access_token){
            oAuth2Client.setCredentials(tokens);

            res.cookie("Youtube_access_token", tokens.access_token, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 1000,  // maxAge is in milliseconds
            });
    
            return res.status(200).redirect("http://localhost:5173")
        }else{
            return res.status(400)
            .json({
                message: "token not generated"
            })
        }
    } catch (error) {
        console.log(error);
        
    }

    
    
    
})

module.exports= router;