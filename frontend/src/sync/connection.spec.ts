import srv from 'socket.io';
import process from 'process';
import { Sync, createConnection } from './connection';
import { createServer, FakeServer } from '../../tests/fake/server';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

describe('Connection', function () {
  let server: FakeServer;

  let port: number;
  let address: string;
  let client: Sync;

  let afterClientConnected: () => Promise<srv.Socket>;

  beforeEach(() => {
    jest.setTimeout(3000);
    port = Math.trunc(9000 + (Math.random() * 900));
    address = `http://127.0.0.1:${port}/`;
    server = createServer(port);
    afterClientConnected = () => new Promise(done => {
      server.socket.on('connect', (socket: srv.Socket) => {
        done(socket);
      })
      server.acceptConnections();
    });
  });

  afterEach(() => {
    client && client.disconnect();
    return server.close();
  });

  test('it connects to a server on port', () => {
    return new Promise(done => {
      client = createConnection(address);
      afterClientConnected().then(srv => {
        expect(srv.id).toBeTruthy();
        done();
      });
    });
  });

  test('joins lobby', () => {
    const roomName = 'r#123r';

    client = createConnection(address);
    client.lobby(roomName);

    return afterClientConnected().then(srv => new Promise<void>(done => {
      srv.on('/join', sentRoomName => {
        expect(roomName).toEqual(sentRoomName);
        done();
      });
    }));
  });

  test('starts ready vote', () => {
    client = createConnection(address);
    client.lobby('#r1');
    client.startVote('ready')

    return afterClientConnected().then(srv => new Promise<void>(done => {
      srv.on('/vote/ready', id => {
        expect(id).toBeTruthy();
        done();
      });
    }));
  });

  test('can cast on a started vote', () => {
    let voteId: string;
    client = createConnection(address);
    client.lobby('#r1');
    client.startVote('ready')
      .then(id => {
        voteId = id;
        client.vote(id, true);
      })

    return new Promise<void>(done => {
      server.on('/vote', (id, response) => {
        expect(id).toStrictEqual(voteId);
        expect(response).toStrictEqual(true);
        done();
      })

      server.acceptConnections();
    });
  });

  test('can listen to a started vote', () => {
    const room = '#r1';

    client = createConnection(address);
    client.lobby(room);
    client.startVote('ready')

    return new Promise(done => {
      let voteId: string;

      server.on('/vote/ready', id => {
        voteId = id;
      });

      client.on('startVote', (room, socketId, id) => {
        // this tests the server but also checks the arguments order passed by the client
        expect(room).toStrictEqual(room);
        expect(socketId).toStrictEqual(client.id);
        expect(id).toStrictEqual(voteId);
        done();
      });

      server.acceptConnections();
    })
  });

  test('can close a vote', () => {
    const room = '#r121231';

    client = createConnection(address);
    client.lobby(room);
    client.startVote('ready')
      .then(id => {
        client.closeVote(id);
      });

    return new Promise(done => {
      let voteId: string;

      server.on('/vote/ready', id => {
        voteId = id;
      })

      server.on('/vote/close', id => {
        expect(id).toStrictEqual(voteId);
        done();
      });

      afterClientConnected();
    });
  });

  test('closing a vote enables listening to vote results', () => {
    const sentRoom = '#r121231';
    const castVote = true;
    let voteId: string;

    client = createConnection(address);
    client.lobby(sentRoom);
    client.startVote('ready')
      .then(id => {
        client.vote(id, castVote);
        client.closeVote(id);
      });

    client.on('startVote', (room, socketId, id) => {
      voteId = id;
    });

    return new Promise(done => {
      const expectedResult = [castVote];

      client.on('closeVote', (room: string, socketId: string, id: string, result: unknown[]) => {
        expect(sentRoom).toStrictEqual(room);
        expect(socketId).toStrictEqual(client.id);
        expect(voteId).toStrictEqual(id);
        expect(expectedResult).toStrictEqual(result)
        done();
      });

      server.acceptConnections();
    });
  });

  // @todo start game
  // @todo accept starting position
  // @todo send move vectors
  // @todo receive move vectors

  // @todo cant start ready vote when not in room (srv side check)
  // @todo cant cast on a non-started vote

});
