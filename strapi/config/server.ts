import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('PUBLIC_URL', `http://${env('HOST', '0.0.0.0')}:${env.int('PORT', 1337)}`),
  proxy: env.bool('PROXY', false),
  cron: {
    enabled: env.bool('CRON_ENABLED', false),
  },
  settings: {
    cors: {
      origin: env.array('CORS_ORIGIN', ['*']),
    },
  },
});

export default config;
