export const getPublicConfig = (req, res) => {
  try {
    const response = {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || null,
        enabled: Boolean(process.env.GOOGLE_CLIENT_ID)
      },
      apple: {
        clientId: process.env.APPLE_CLIENT_ID || null,
        redirectURI: process.env.APPLE_REDIRECT_URI || null,
        scopes: process.env.APPLE_SCOPES || 'name email',
        enabled: Boolean(process.env.APPLE_CLIENT_ID && process.env.APPLE_REDIRECT_URI)
      },
      facebook: {
        appId: process.env.FACEBOOK_APP_ID || null,
        version: process.env.FACEBOOK_GRAPH_VERSION || 'v19.0',
        enabled: Boolean(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Config fetch error:', error);
    res.status(500).json({ error: 'Unable to load configuration' });
  }
};
