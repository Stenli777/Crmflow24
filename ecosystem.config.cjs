/**
 * PM2 — пример для staging CRM Flow24.
 * Секреты не хранить здесь: используйте .env в cwd приложения.
 *
 * Запуск:
 *   pm2 start ecosystem.config.cjs --only crmflow24-stage
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: "crmflow24-stage",
      cwd: "/var/www/crmflow24-stage/site",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "crmflow24-prod",
      cwd: "/var/www/crmflow24/site",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
