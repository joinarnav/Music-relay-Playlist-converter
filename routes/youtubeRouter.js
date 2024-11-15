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
    
        if(tokens && tokens.access_token){
            oAuth2Client.setCredentials(tokens);

            res.cookie("Youtube_access_token", tokens.access_token, {
                httpOnly: true,
                path: '/',
                secure: false,
                sameSite: 'Lax',
                maxAge: 60 * 60 * 1000,
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

router.route('/convertPlaylist').post(async (req, res) => {
    const cookie = req.cookies
    const spotifyAccessToken = cookie.Spotify_access_token;
    const youtubeAccessToken = cookie.Youtube_access_token;
    
    if(!spotifyAccessToken || !youtubeAccessToken){
        return res.status(400).json({
            "message" : "needed both tokens"
        })
    }

    if(spotifyAccessToken){
        const data = await axios.get(`https://api.spotify.com/v1/playlists/${spotifyPlaylist.id}/tracks`, {
            headers: {
                Authorization: `Bearer ${spotifyAccessToken}`,
            },
        })

        const playlistItems = data.data

        const youtubeVideosIds = [];
        await Promise.all(
            playlistItems?.items.map(async (elem) => {
            const name = `${elem.track.name} by ${elem.track.artists[0].name}|${elem.track.album.name}|Song`
            const url = `https://youtube.googleapis.com/youtube/v3/search?part=id&maxResults=1&q=${encodeURIComponent(name)}&type=video&videoCategoryId=10`;
            const data = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${youtubeAccessToken}`,
                },
            });
            if (res.data?.items?.length > 0) {
                youtubeVideosIds.push(data.data.items[0].id.videoId);
            }
        })
        )

        const data2 = await axios.post('https://youtube.googleapis.com/youtube/v3/playlists?part=id&part=snippet', {
            "snippet" : {
                "title": `${hehehehe}`
            }
        }, {
            headers: {
                Authorization: `Bearer ${youtubeAccessToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })

        const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet`;
        for(let i=0; i<youtubeVideosIds.length; i++){
            const data = {
                snippet: {
                    playlistId: id,
                    resourceId: {
                        videoId: youtubeVideosIds[i],
                        kind: "youtube#video",
                    }
                }
            };
            await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${youtubeAccessToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }
    }
    
})

module.exports= router;