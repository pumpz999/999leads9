module.exports = {
  apps: [{
    name: "xxxcams-platform",
    script: "npm",
    args: "run start",
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }],
  deploy: {
    production: {
      user: "deploy",
      host: "your-server-ip",
      ref: "origin/main",
      repo: "git@github.com:yourusername/xxxcams-platform.git",
      path: "/var/www/xxxcams",
      "post-deploy": "npm install && npm run build && pm2 reload ecosystem.config.js"
    }
  }
};
