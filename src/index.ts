import { WebSocketServer,WebSocket } from 'ws';
import { createClient } from 'redis';

const publishClient=createClient();  //one for publish to pubsub
publishClient.connect();

const subscribeClient=createClient();  //this is for the subscribe to pubsub
subscribeClient.connect();


const wss = new WebSocketServer({ port: 8080 });


const subscription:{[key:string]:{
    ws:WebSocket, 
    rooms:string[]  
}}={}


wss.on('connection', function connection(userSoket) {
    const id=randomId()
    subscription[id]={
        ws:userSoket,
        rooms:[]
    }

  userSoket.on('message', function message(data) {
    //@ts-ignore
    const userMessage=JSON.parse(data as unknown as string)
    if(userMessage.type==="SUBSCRIBE"){
        subscription[id].rooms.push(userMessage.room)//means when user subscribe to subscription arrayeven user is first user or not user
        if(oneUserSubscribedTo(userMessage.room)){
            subscribeClient.subscribe(userMessage.room,(message)=>{
                const userMessage=JSON.parse(message);//after getting the message 
                Object.keys(subscription).forEach((userId)=>{//when we first time(is is for one subscription)
                    const {ws,rooms}=subscription[userId];//getting the rooms,and ws 
                    if(rooms.includes(userMessage.roomId)){//if roomId is in rooms then we send back to ws
                        ws.send(userMessage.message);//we will send the message to websoket
                    }
                })
            })
        }
    }


    //unsubscribe to pubsubs
    if (userMessage.type === "UNSUBSCRIBE") {
        subscription[id].rooms = subscription[id].rooms.filter(x => x !== userMessage.room)
        if (lastPersonLeftRoom(userMessage.room)) {
            console.log("unsubscribing from pub sub on room" + userMessage.room);
            subscribeClient.unsubscribe(userMessage.room);
        }
    }
    
    if(userMessage.type==="sendMessage"){
        const message=userMessage.message;
        const roomId=userMessage.roomId;

        //ws normally publish to pubsub
       publishClient.publish(roomId,JSON.stringify({
        type:"sendMessage",
        roomId:roomId,
        message
       }))

    }
  });



  userSoket.send('something');
});


function randomId(){
    return Math.random()
}


//it is checking for when only subscribe to first user not doing the repeat
function oneUserSubscribedTo(roomId: string) {
    let totalInterestedPeople = 0;
    Object.keys(subscription).map(userId => {
        if (subscription[userId].rooms.includes(roomId)) {//checking this room already present in subscription or not
            totalInterestedPeople++;
        }
    })
    if (totalInterestedPeople == 1) {
        return true;
    }
    return false;
}


function lastPersonLeftRoom(roomId: string) {
    let totalInterestedPeople = 0;
    Object.keys(subscription).map(userId => {
        if (subscription[userId].rooms.includes(roomId)) {
            totalInterestedPeople++;
        }
    })
    if (totalInterestedPeople == 0) {
        return true;
    }
    return false;
}
