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
  let connectionID = event['websocket']['secConnectionID'];
  const conn = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = conn.db(DATABASE_NAME);
  const collection = db.collection(collectionName)
  collection.remove({'connectionID': connectionID})
  return event;
}
