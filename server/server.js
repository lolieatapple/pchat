const WebSocket = require('ws');

const server = new WebSocket.Server({port: 8080 });

let rooms = [];

function broadcast(room, msg, self) {
  console.log('broadcast in', room.roomCode, msg);
  for (let i=0; i<room.personWs.length; i++) {
    if (room.personWs[i] !== self) {
      room.personWs[i].send(JSON.stringify(msg));
    }
  }
}

server.on('open', function open() {
  console.log('connected');
});

server.on('close', function close() {
  console.log('disconnected');
});

function createRoomCode(code) {
  let find = false;

  while(true) {
    let roomCode;
    if (code && !find) {
      roomCode = code;
    } else {
      roomCode = Math.floor(Math.random()*10000).toString();
    }

    find = false;

    for (let i=0; i<rooms.length; i++) {
      if (rooms[i].roomCode === roomCode) {
        find = true;
        break;
      }
    }
    if (!find) {
      return roomCode;
    }
  }
}

function joinRoom(roomCode, ws, req) {
  let ip = req.socket.remoteAddress+':'+req.socket.remotePort;
  let find = false;
  for (let i=0; i<rooms.length; i++) {
    if (rooms[i].roomCode === roomCode) {
      find = true;
      rooms[i].personIp.push(ip);
      rooms[i].personWs.push(ws);
      broadcast(rooms[i], {
        type: 'update',
        members: rooms[i].personIp.length,
        roomCode: rooms[i].roomCode
      }, null);
      console.log('joined room:', rooms[i].roomCode);
      break;
    }
  }

  if (!find) {
    createRoom(roomCode, ws, req);
  }
}

function createRoom(roomCode, ws, req) {
  let room = {}
  if (roomCode === '') {
    room.roomCode = createRoomCode();
  } else {
    room.roomCode = createRoomCode(roomCode);
  }
  room.personIp = [];
  room.personWs = [];
  room.personIp.push(req.socket.remoteAddress+':'+req.socket.remotePort);
  room.personWs.push(ws);
  rooms.push(room);
  broadcast(room, {
    type: 'update',
    members: room.personIp.length,
    roomCode: room.roomCode
  }, null);
  console.log('room created:', room.roomCode);
}

function sendMsg(roomCode, ws, msg) {
  for (let i=0; i<rooms.length; i++) {
    if (rooms[i].roomCode === roomCode) {
      broadcast(rooms[i], msg, ws);
      console.log('send msg:', rooms[i].roomCode);
      break;
    }
  }
}

server.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log('ip', ip, req.socket.remotePort);
  ws.on('message', function incoming(message) {
    console.log(message);
    if (!(message.includes('{') && message.includes('}'))) {
      return;
    }

    let msg = JSON.parse(message);
    switch (msg.type) {
      case 'msg':
        console.log('send msg:', msg.roomCode);
        if (msg.roomCode === '') {
          return;
        }
        sendMsg(msg.roomCode, ws, msg);
        break;
      case 'cmd':
        if (msg.content === 'create') {
          console.log('create room');
          createRoom(msg.roomCode, ws, req);
        } else {
          console.log('join room:', msg.roomCode);
          if (msg.roomCode === '') {
            return;
          }
          joinRoom(msg.roomCode, ws, req);
        }
        break;
      default:
        break;
    }
  });

  ws.on('close', (code, reason) => {
    console.log('client leave close:', code, reason);
    for (let i=0; i<rooms.length; i++) {
      let index = rooms[i].personIp.indexOf(req.socket.remoteAddress + ":" + req.socket.remotePort);
      if ( index !== -1 ) {
        rooms[i].personIp.splice(index, 1);
        rooms[i].personWs.splice(index, 1);
        if (rooms[i].personIp.length > 0) {
          broadcast(rooms[i], {
            type: 'update',
            members: rooms[i].personIp.length,
            roomCode: rooms[i].roomCode
          }, null);
        } else {
          console.log('nobody in room', rooms[i].roomCode, ', destroy room.');
          rooms.splice(i, 1);
        }

        break;
      }
    }
  });

  ws.on('pong', (data) => {
    console.log('pong', req.socket.remoteAddress + ":" + req.socket.remotePort);
  });

});

function ping() {
  server.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.ping();
      console.log('ping sent.');
    }
  });
}

setInterval(ping, 5000);

console.log('server started at 8080');
