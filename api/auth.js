module.exports = (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  
  if (!clientId) {
    return res.status(500).send('SPOTIFY_CLIENT_ID not set');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: 'https://now-playing-profile-lac.vercel.app/api/callback',
    scope: 'user-read-currently-playing user-read-recently-played user-read-playback-state'
  });

  res.writeHead(302, { Location: `https://accounts.spotify.com/authorize?${params}` });
  res.end();
};
