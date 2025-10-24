module.exports = (req, res) => {
  res.json({
    hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
    hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
    hasRefreshToken: !!process.env.SPOTIFY_REFRESH_TOKEN,
    clientIdLength: process.env.SPOTIFY_CLIENT_ID?.length || 0
  });
};
