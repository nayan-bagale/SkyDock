module.exports = {
apps : [{
    name   : "Skydock Backend",
    script : "dist/index.js",

      env_production: {
        NODE_ENV: "prod",
        PORT: 3000,
      },
  }]
};