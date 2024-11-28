import React, { useState, useEffect } from 'react';
import axios from "axios";

export const App = () => {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState(false);
  const [youtubeAccessToken, setYoutubeAccessToken] = useState(false);
  const [SpotifyPlaylist, setSpotifyPlaylist] = useState([]);  
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  console.log(SpotifyPlaylist);
  

  const handleSpotifyLogin = async () => {
    const response= await axios.get('http://localhost:3000/spotify/login');
    window.location.href = response.data
  };

  const handleYouTubeLogin = async () => {    
    const response= await axios.get("http://localhost:3000/youtube/login");
    
    const responseAuth= response.data.authUrl;
    window.location.href = responseAuth;
  };

  useEffect(() => {
    const getCookies = async() => {
      let cookies = await axios.get("http://localhost:3000/cookies/getCookies", {
        withCredentials: true
      });

      cookies = cookies.data
      
      if(cookies?.cookie?.Spotify_access_token && !spotifyAccessToken){
        setSpotifyAccessToken(true)
      }
      if(cookies?.cookie?.Youtube_access_token && !youtubeAccessToken){
        setYoutubeAccessToken(true)
      }
    }
    getCookies();
  },[setSpotifyAccessToken, setYoutubeAccessToken, spotifyAccessToken, youtubeAccessToken])

  useEffect(() => {
    try {
      const getSpotifyPlaylist = async() => {
        const data = await axios.get("http://localhost:3000/spotify/getPlaylist", {
          withCredentials: true
        })
        if(data.data.items){
          setSpotifyPlaylist(data.data.items)
        }
      }
      getSpotifyPlaylist()
    } catch (error) {
      console.error(error);
    }
  },[setSpotifyPlaylist])

  const handleConvert = async() => {
    await axios.post('http://localhost:3000/youtube/convertPlaylist')
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen w-full bg-blue-300'>
      <h1 className='font-bold text-3xl py-2'>Playlist Converter</h1>
      <div className='flex min-h-[400px] min-w-[600px] border-black border-2 justify-evenly'>
        {
          !spotifyAccessToken &&
          <button className="" onClick={handleSpotifyLogin}>
            Login with Spotify
          </button>
        }
        {
          spotifyAccessToken &&
          <div>
            {
              SpotifyPlaylist && SpotifyPlaylist.length>0 &&
              SpotifyPlaylist.map((elem, index) => {
                return(
                  <button 
                      onClick={() => {
                        setSelectedPlaylistId(elem.id)
                      }}
                      key={index} 
                      className={`px-3 py-1 flex flex-row items-center hover:bg-gray-300 hover:transition-all hover:ease-in-out hover:duration-200 ${selectedPlaylistId===elem.id && 'bg-gray-300'}`}
                  >
                      <img src={elem?.images[0]?.url} alt="" width={50} height={50} />
                      <div className="flex flex-col items-start justify-start px-3 py-1">
                          <h1 className="text-lg text-black font-semibold">
                              {elem?.name}
                          </h1>
                          <h3>{elem?.tracks?.total} Tracks</h3>
                      </div>
                  </button>
                )
              })
            }
          </div>
        }
        
        {
          !youtubeAccessToken &&
          <button className='' onClick={handleYouTubeLogin}>
            Login with YouTube
          </button>
        }

        {
          youtubeAccessToken && spotifyAccessToken && 
          <button
            onClick={handleConvert}
          >
            convert
          </button>
        }
        
      </div>
    </div>
  );
}

export default App;
