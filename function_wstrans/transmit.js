const fetch = require("node-fetch");
//const tcb = require('tcb-admin-node')


/*
const app = tcb.init({
  secretId: process.env.SecretId,
  secretKey: process.env.SecretKey,
  env: process.env.MongoId,
  serviceUrl: 'https://tcb-admin.tencentcloudapi.com/admin'
})

const db = app.database()
const _ = db.command
*/
const { MongoClient } = require("mongodb");
const MONGODB_URL = process.env.MONGODB_URL
const DATABASE_NAME = "chat-app"
const collectionName = 'app-users'

exports.main_handler = async (event, context, callback) => {
  console.log(event);
  if (!('websocket' in event)) {
      return {"errNo": 102, "errMsg": "not found web socket"};
  }
  let data = event['websocket']['data'];
  //let connectionID = event['websocket']['secConnectionID'];
  //let sendbackHost = "http://set-websocket.cb-common.apigateway.tencentyun.com/api-2mqlmzvy"
  let sendbackHost = "http://set-websocket.cb-common.apigateway.tencentyun.com/api-d9r3edeo"
  let retmsg = {}
  retmsg['websocket'] = {}
  retmsg['websocket']['action'] = "data send"
  retmsg['websocket']['dataType'] = 'text'
  //retmsg['websocket']['data'] = JSON.stringify(data)
  retmsg['websocket']['data'] = data

  const conn = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = conn.db(DATABASE_NAME);
  const collection = db.collection(collectionName);
  //const entries = await collection.find();

  collection.find().forEach( async function(entry) {
    let connectionID = entry["connectionID"]
    retmsg['websocket']['secConnectionID'] = connectionID
    let data1;
    let res;
    let opts = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(retmsg)
    };

    try {
      res = await fetch(sendbackHost, opts);
      data1 = await res.json();
    } catch (e) {
      console.log(e)
    }
    console.log(data1)
  });

};
