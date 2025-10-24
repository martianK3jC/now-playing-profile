const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const code = req.query.code;
  const redirect_uri = 'https://now-playing-profile-lac.vercel.app/api/callback';
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    })
  });
  
  const data = await response.json();
  
  if (data.refresh_token) {
    res.send(`
      <html>
        <head><title>Spotify Refresh Token</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; background: #191414; color: #1DB954;">
          <h1>✅ Success!</h1>
          <h2>Your Refresh Token:</h2>
          <p style="background: #282828; padding: 20px; border-radius: 8px; word-break: break-all; color: white;">
            ${data.refresh_token}
          </p>
          <p>Copy this token and add it to your Vercel environment variables as <strong>SPOTIFY_REFRESH_TOKEN</strong></p>
        </body>
      </html>
    `);
  } else {
    res.send(`<h1>Error:</h1><pre>${JSON.stringify(data, null, 2)}</pre>`);
  }
};
