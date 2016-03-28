var redis = require('redis');
var redisClient = redis.createClient(6379);

redisClient.on('error', function (err) {
    console.log('error' + err);
});

redisClient.on('connect', function () {
    console.log('redis is ready');
});

exports.redis = redis;
exports.redisClient = redisClient;