module.exports = async (req, res) => {
  try {
    const code = req.query.code;
    
    if (!code) {
      return res.status(400).send('<h1>Error: No code provided</h1>');
    }

    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      return res.status(500).send('<h1>Error: Missing environment variables</h1>');
    }

    const redirect_uri = 'https://now-playing-profile-lac.vercel.app/api/callback';
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      }).toString()
    });
    
    const data = await response.json();
    
    if (data.refresh_token) {
      res.send(`
        <html>
          <head>
            <title>Spotify Refresh Token</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                background: #191414;
                color: #1DB954;
              }
              .token-box {
                background: #282828;
                padding: 20px;
                border-radius: 8px;
                word-break: break-all;
                color: white;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <h1>✅ Success!</h1>
            <h2>Your Refresh Token:</h2>
            <div class="token-box">${data.refresh_token}</div>
            <p>Copy this token and add it to your Vercel environment variables as <strong>SPOTIFY_REFRESH_TOKEN</strong></p>
            <ol>
              <li>Go to your Vercel project</li>
              <li>Click Settings → Environment Variables</li>
              <li>Add: SPOTIFY_REFRESH_TOKEN = (paste the token above)</li>
              <li>Redeploy your project</li>
            </ol>
          </body>
        </html>
      `);
    } else {
      res.send(`
        <html>
          <head><title>Error</title></head>
          <body style="font-family: Arial; padding: 40px; background: #191414; color: #ff6b6b;">
            <h1>❌ Error Getting Token</h1>
            <pre style="background: #282828; padding: 20px; border-radius: 8px; color: white;">${JSON.stringify(data, null, 2)}</pre>
          </body>
        </html>
      `);
    }
  } catch (error) {
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; padding: 40px;">
          <h1>Error:</h1>
          <pre>${error.message}</pre>
        </body>
      </html>
    `);
  }
};
