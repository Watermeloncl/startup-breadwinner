const { WebSocketServer } = require('ws');
const uuid = require('uuid');

class PeerProxy {
  constructor(httpServer) {
    const wss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    });

    let connections = [];
    let scores = [];

    wss.on('connection', (ws) => {
      console.log("connection");
      const connection = { id: uuid.v4(), alive: true, ws: ws, score: null };

      let newScore = { id: connection.id, name: null, level: null, time: null };
      connection.score = newScore;

      connections.push(connection);

      let newEvent = {id: connection.id, type: 'load', name: 'server', level: 0,
        time: 0, scoresArray: scores };
      let newData = JSON.stringify(newEvent);

      connection.ws.send(newData);

      ws.on('message', function message(data) {

        const incomingEvent = JSON.parse(data);
        let newEvent = { id: connection.id, type: incomingEvent.type, name: incomingEvent.name,
          level: incomingEvent.level, time: incomingEvent.time };
        let newData = JSON.stringify(newEvent);

        if(incomingEvent.type == 'start') {
          connection.score.name = incomingEvent.name;
          connection.score.level = incomingEvent.level;
          connection.score.time = incomingEvent.time;

          let newScore = connection.score;
          scores.push(newScore);
        } else if(incomingEvent.type == 'end') {
          connection.score.name = null;
          connection.score.level = null;
          connection.score.time = null;

          for(const [i, score] of scores.entries()) {
            if(score.id == connection.id) {
              scores.splice(i, 1);
            }
          }
        } else if(incomingEvent.type == 'update') {
          connection.score.name = incomingEvent.name;
          connection.score.level = incomingEvent.level;
          connection.score.time = incomingEvent.time;

          for(const [i, score] of scores.entries()) {
            if(score.name == incomingEvent.name) {
              scores.splice(i, 1);
              break;
            }
          }
        
          let newScore = { id: connection.id, name: incomingEvent.name, level: incomingEvent.level, time: incomingEvent.time }
          let found = false;
          for(const [i, score] of scores.entries()) {
            if ((newScore.level) > score.level) {
              scores.splice(i, 0, newScore);
              found = true;
              break;
            } else if((newScore.level) == score.level) {
              if(newScore.timeScore < score.time) {
                scores.splice(i, 0, newScore);
                found = true;
                break;
              }
            }
          }
        
          if(!found) {
            scores.push(newScore);
          }
        }

        connections.forEach((c) => {
          if (c.id !== connection.id) {
            c.ws.send(newData);
          }
        });
      });

      ws.on('close', () => {
        console.log("socket closed");

        for(const [i, score] of scores.entries()) {
          if(score.id == connection.id) {
            scores.splice(i, 1);
            break;
          }
        }

        let newEvent = {id: connection.id, type: 'end', name: connection.score.name,
         level: connection.score.level, time: connection.score.time };
        let newData = JSON.stringify(newEvent);

        connection.score.name = null;
        connection.score.level = null;
        connection.score.time = null;
        
        connections.forEach((c) => {
          if (c.id !== connection.id) {
            c.ws.send(newData);
          }
        });

        connections.findIndex((o, i) => {
          if (o.id === connection.id) {
            connections.splice(i, 1);
            return true;
          }
        });
      });

      ws.on('pong', () => {
        connection.alive = true;
      });
    });

    setInterval(() => {
      connections.forEach((c) => {
        if (!c.alive) {
          c.ws.terminate();
        } else {
          c.alive = false;
          c.ws.ping();
        }
      });
    }, 10000);
  }
}

module.exports = { PeerProxy };