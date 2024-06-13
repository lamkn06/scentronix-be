export default () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 8080,
  CORS_ORIGIN: '*',
});
