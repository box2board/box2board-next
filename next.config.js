/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/:league(mlb|nba|nfl|nhl)/scores', destination: '/:league', permanent: true },
      { source: '/:league(mlb|nba|nfl|nhl)/schedule', destination: '/:league', permanent: true }
    ];
  }
};

module.exports = nextConfig;
