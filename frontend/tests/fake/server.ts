import SocketIO from 'socket.io';
import { v4 as uuid } from 'uuid';
import {Rules} from "../../src/sync/connection";

type Callback = (... args: any[]) => void;

export type FakeServer = {
  socket: SocketIO.Server, acceptConnections: () => void,
  on: (e: string, cb: Callback) => void,
  close: () => Promise<void>,
};

export function createServer(
  port: number
): FakeServer {
  const registerSocketEvents: [string, Callback][] = [];
  const response = {
    socket: SocketIO(),
    acceptConnections(): void {
      response.socket.listen(port);
    },
    on(evt: string, callback: Callback): void {
      registerSocketEvents.push([evt, callback]);
    },
    close(): Promise<void> {
      return new Promise<void>(done => response.socket.close(done));
    }
  };

  addEvents(response.socket, registerSocketEvents);

  return response;
}

function addEvents(srv: SocketIO.Server, registerEvents: [string, Callback][]): SocketIO.Server {
  const voteStorage: {[k: string]: unknown[]} = {};

  srv.on('connect', socket => {

    srv.emit('/connected', socket.id);

    socket.on('/join', (room: string) => {
      socket.join(room);
      srv.in(room).emit('/join', socket.id);
    });

    socket.on('/vote/ready', (voteId: string) => {
      voteStorage[voteId] = [];
      Object.keys(socket.rooms)
        .filter(roomId => roomId !== socket.id)
        .forEach(roomId => {
          srv.in(roomId).emit('/vote/ready', roomId, socket.id, voteId);
        });
    });
    socket.on('/vote', (voteId: string, result: unknown) => {
      // @todo double-votes, disable changing votes
      voteStorage[voteId].push(result);
      Object.keys(socket.rooms)
        .filter(roomId => roomId !== socket.id)
        .forEach(roomId => {
          srv.in(roomId).emit('/vote', roomId, socket.id, voteId, result)
        })
    });
    socket.on('/vote/close', (voteId: string) => {
      Object.keys(socket.rooms)
        .filter(roomId => roomId && roomId !== socket.id)
        .forEach(roomId => {
          srv.in(roomId).emit('/vote/close', roomId, socket.id, voteId, voteStorage[voteId])
        });
      delete voteStorage[voteId];
    });

    socket.on('/game', (rules: Rules) => {
      // @todo start game world
      const generatedGameId = uuid();
      Object.keys(socket.rooms)
        .filter(roomId => roomId && roomId !== socket.id)
        .forEach(roomId => {
          srv.in(roomId).emit('/game', generatedGameId, rules, socket.id)
        });
    });

    registerEvents.forEach(([evt, callback]) => socket.on(evt, callback));
  });

  return srv;
}
