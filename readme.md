##installation

```
git clone https://github.com/chenminhua/sniper
cd sniper
npm install
```

## run the back-end api
run your mongo and redis-server; If you want to change the configurations of mongodb and redis-server.
 
You can do it on api/server.js api/config/redis_dastabase.js

```
node api/server
```

## install the front-end
```
cd app/public
bower install
```

## run the front-end
```
http-server -a 0.0.0.0 -p 8000 app
```
now you can use your favourite browser to play with the website in 127.0.0.1:8000

## Stack
express, mongo, redis, angularjs
