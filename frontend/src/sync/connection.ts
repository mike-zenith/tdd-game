import io from 'socket.io-client';
import Socket = SocketIOClient.Socket;

export class Sync {

  private whenConnectedPromise: Promise<Socket>;
  private whenConnectedPromiseReject: (reason?: unknown) => void;

  public constructor(private readonly client: Socket) {
  }

  public get id(): string {
    return this.client.id;
  }

  private get socket(): Promise<Socket> {
    if (this.client.connected) {
      return Promise.resolve(this.client);
    }
    return this.whenConnected();
  }

  private whenConnected(): Promise<Socket> {
    if (!this.whenConnectedPromise) {
      this.whenConnectedPromise = new Promise<Socket>((done, fail) => {
        this.whenConnectedPromiseReject = fail;
        this.client.on('connect', () => done(this.client));
      });
    }
    return this.whenConnectedPromise;
  }

  public on(evt: 'closeVote', callback: (room: string, person: string, voteId: string, results: (string|boolean)[]) => void): void;
  public on(evt: 'startVote', callback: (room: string, person: string, id: string) => void): void;

  public on(evt: string, callback: CallableFunction): void {
    const evtTransformMap: { [k:string]: string } = {
      'closeVote': '/vote/close',
      'startVote': '/vote/ready'
    }
    this.client.on(evtTransformMap[evt], callback);
  }

  async lobby(roomName: string): Promise<void> {
    const socket = await this.socket;
    socket.emit('/join', roomName);
  }

  async startVote(type: 'ready'): Promise<string> {
    const socket = await this.socket;
    const id = 'a';
    socket.emit(`/vote/${type}`, id);
    return id;
  }

  async closeVote(voteId: string): Promise<void> {
    const socket = await this.socket;
    socket.emit('/vote/close', voteId);
  }

  async vote(id: string, response: unknown): Promise<void> {
    const socket = await this.socket;
    socket.emit('/vote', id, response);
  }

  public disconnect(): void {
    this.whenConnectedPromiseReject && this.whenConnectedPromiseReject(new Error('Disconnected'));
    this.client.disconnect();
  }
}

export function createConnection(address: string): Sync {
  const client = io.connect(address);
  return new Sync(client);
}
