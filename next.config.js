module.exports = {
  images: {
    domains: ['images.unsplash.com', 'images.ctfassets.net'],
    deviceRatio: '3/2',
  },
  env: {
    publicRuntimeConfig: {
      nextAuthUrl: process.env.NEXTAUTH_URL,
    },
  },
};