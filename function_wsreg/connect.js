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
  // check whether request format is correct
  if (!('requestContext' in event)) {
    return {"errNo": 101, "errMsg": "Request context not found"}
  }
  if (!('websocket' in event)) {
    return {"errNo": 102, "errMsg": "Web socket not found"}
  }
  let connectionID = event['websocket']['secConnectionID']

  const conn = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  const db = conn.db(DATABASE_NAME);

  // add connectionID to database
  /*
  if (!(collectionName in db.getCollectionNames())) {
    db.createCollection(collectionName);
  }
  */

  const collection = db.collection(collectionName);
  await collection.insert({ connectionID: connectionID });

  let retmsg = {}
  retmsg['errNo'] = 0
  retmsg['errMsg'] = "ok"
  retmsg['websocket'] = {
    "action": "connecting",
    "secConnectionID": connectionID
  }
  retmsg['websocket']['secWebSocketProtocol'] = event['websocket']['secWebSocketProtocol']
  return retmsg
}
