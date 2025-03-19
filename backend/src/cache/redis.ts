import Redis from "ioredis";

const redis = new Redis(process.env.NODE_ENV === "production" ? process.env.REDIS_URL || "redis://localhost:6379" : "redis://localhost:6379");

export default redis;
