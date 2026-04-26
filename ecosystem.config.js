module.exports = {
  apps: [
    {
      name: 'venetian-backend',
      script: 'npm',
      args: 'start',
      cwd: './strapi',
      shell: true,
      env: {
        NODE_ENV: 'production',
        PORT: 1338
      }
    },
    {
      name: 'venetian-frontend',
      script: 'npm',
      args: 'start',
      cwd: '.',
      shell: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
