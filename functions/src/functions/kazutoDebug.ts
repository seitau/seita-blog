import firebase from '../common/firebase';
import * as line from '@line/bot-sdk';

let config;
if (process.env.NODE_ENV === 'test') {
    config = {
        channelAccessToken: "hmpYM37PbsOJZflZFGfpOsD/GNEVibdasxvC1nu0JYl1LBnntJK3M1R9A+0eruGo0bDmeWS10aBscx19S0kboBTqjKX61W1LkOprxElSwlNowN3k4xDggWRvo6GKDbUO4m5V+IUyLMwWbMyTfSEnlQdB04t89/1O/w1cDnyilFU=",
        channelSecret: "60b3d9b4b345b270c9ffaf89db3e475a",
    };
} else {
    //const channel_env = firebase.functions.config().channel;
    config = {
        channelAccessToken: "hmpYM37PbsOJZflZFGfpOsD/GNEVibdasxvC1nu0JYl1LBnntJK3M1R9A+0eruGo0bDmeWS10aBscx19S0kboBTqjKX61W1LkOprxElSwlNowN3k4xDggWRvo6GKDbUO4m5V+IUyLMwWbMyTfSEnlQdB04t89/1O/w1cDnyilFU=",
        channelSecret: "60b3d9b4b345b270c9ffaf89db3e475a",
    };
}

const client = new line.Client(config);

function handleEvent(event) {
    console.log(event);
    let message;

    if (event.type === 'message' && event.message.type === 'text') {
        //message = event.message.text;
        const userId = event.source.userId;
        message = userId;
        return client.replyMessage(event.replyToken, { type: "text", text: message })  } 

    return client.replyMessage(event.replyToken, { type: "text", text: message });
}

export default firebase.functions
    .https.onRequest(async (req, res) => {
        return Promise
            .all(req.body.events.map(handleEvent))
            .then(result => res.status(200).send(`Success: ${result}`))
            .catch(err => res.status(400).send(err.toString()));
    });

