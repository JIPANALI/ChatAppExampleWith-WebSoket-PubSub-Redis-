this is just how websoket with Room
1. npm init -y
2. npx tsc --init
3. change the rootDir,outDir to src,dist
4. npm i ws  from npm and as well connection how that can also you can copy from npm 
5. npm i @types/ws
6. import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});    //this is how we will connect to websoket

7. "scripts": {
    "build":"tsc -b",
    "start":"node dist/index.js"
  }, update in package.json



<!-- Now we will do pubsub with redis  -->
Here we will do the using docker we will run the redis locally
for Locally running redisc in docker ==>docker run -p 6379:6379 redis

1. docker run -p 6379:6379 redis
2. npm i redis
3. now you can start==>npm run build 
4. npm run start 
then you one from hobscothch as we do like 
ws://localhost:8080 and {
  "type":"sendMessage",
  "roomId":"room1",
  "message":"jipan"
}

 and in other postman ws://localhost:8080  and {
  "type":"SUBSCRIBE",
  "room":"room1"
}


<!-- -------------------- -->
you can check by the two different server of websoket like put in your code websoket:8080 and npm run build and npm run start 

----
wbsSoket:8081 and npm run build and npm run start

and as usual do you work from 
one 8080 from postman and other from hobscotch 8081

==>read the readme you will better understand