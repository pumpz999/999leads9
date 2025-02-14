module.exports = {
  apps: [{
    name: "model-sync-platform",
    script: "index.js",
    instances: "max",
    exec_mode: "cluster",
    watch: true,
    ignore_watch: ["node_modules", "logs"],
    max_memory_restart: "500M",
    env: {
      NODE_ENV: "production"
    }
  }]
};
