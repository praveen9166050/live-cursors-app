const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const {v4: uuidv4} = require('uuid');

const server = http.createServer();
const ws = new WebSocketServer({server});

const connections = {};
const users = {};

const broadcast = () => {
  Object.keys(connections).forEach(uuid => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  })
}

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];
  user.state = message;
  broadcast();
  console.log(`${user.username} updated their state: ${JSON.stringify(user.state)}`);
}

const handleClose = (uuid) => {
  // const connection = connections[uuid];
  // const user = users[uuid];
  console.log(`${users[uuid].username} disconnected`);
  delete connections[uuid];
  delete users[uuid];
  broadcast();
}

ws.on('connection', (connection, request) => {
  // ws://localhost:8000?username=abc
  const {username} = url.parse(request.url, true).query;
  console.log(`${username} connected`);
  const uuid = uuidv4();
  connections[uuid] = connection;
  users[uuid] = {
    username,
    state: {}
  };
  connection.on('message', (message) => handleMessage(message, uuid));
  connection.on('close', () => handleClose(uuid));
})

const port = 8000;
server.listen(port, () => {
  console.log(`Websocket server is running on port ${port}`);
});