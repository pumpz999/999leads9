module.exports = {
  apps: [
    {
      name: "999leads-platform",
      script: "index.js",
      watch: true,
      ignore_watch: ["node_modules", "data"],
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production"
      },
      time: true
    }
  ]
}
