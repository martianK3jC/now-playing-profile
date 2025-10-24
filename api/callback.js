module.exports = async (req, res) => {
  const code = req.query.code;
  
  if (!code) {
    return res.status(400).send('No code provided');
  }

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://now-playing-profile-lac.vercel.app/api/callback'
      })
    });
    
    const data = await response.json();
    
    if (data.refresh_token) {
      res.send(`
        <html>
          <head><title>Success!</title></head>
          <body style="font-family: Arial; padding: 40px; background: #191414; color: #1DB954;">
            <h1>✅ Success!</h1>
            <h2>Your Refresh Token:</h2>
            <div style="background: #282828; padding: 20px; border-radius: 8px; color: white; word-break: break-all;">
              ${data.refresh_token}
            </div>
            <p>Add this to Vercel as <strong>SPOTIFY_REFRESH_TOKEN</strong></p>
          </body>
        </html>
      `);
    } else {
      res.send(`<h1>Error:</h1><pre>${JSON.stringify(data, null, 2)}</pre>`);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
};
