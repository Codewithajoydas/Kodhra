const redis = require("redis");
const dotenv = require("dotenv");
dotenv.config();
const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 14931,
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

(async () => {
  await client.connect();
  console.log("Connected to Redis");
})();

module.exports = client;
