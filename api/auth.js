module.exports = (req, res) => {
  try {
    // Check if environment variable exists
    if (!process.env.SPOTIFY_CLIENT_ID) {
      return res.status(500).send('SPOTIFY_CLIENT_ID is not set in environment variables');
    }

    const scope = 'user-read-currently-playing user-read-recently-played user-read-playback-state';
    const redirect_uri = 'https://now-playing-profile-lac.vercel.app/api/callback';
    
    const authUrl = 'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: redirect_uri,
        scope: scope,
      }).toString();
    
    res.writeHead(302, { Location: authUrl });
    res.end();
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
};
