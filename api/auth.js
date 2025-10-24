module.exports = (req, res) => {
  const scope = 'user-read-currently-playing user-read-recently-played';
  // Use your production URL here
  const redirect_uri = 'https://YOUR_PRODUCTION_URL.vercel.app/api/callback';
  
  const authUrl = 'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: redirect_uri,
      scope: scope,
    });
  res.redirect(authUrl);
};
