import webSocket from 'ws';
import url from 'url';

interface WebSocketWithEvents extends webSocket.WebSocket {
  subscribedEvents: string[];
}

export class WebSocketServer {
  private static wss: webSocket.Server<webSocket.WebSocket>;
  private currentActiveUsers: number = 0;

  constructor(opts: webSocket.ServerOptions) {
    if (!WebSocketServer.wss) {
      WebSocketServer.wss = new webSocket.Server(opts);

      WebSocketServer.wss.on('connection', (conn: WebSocketWithEvents, req) => {
        const query = url.parse(req.url!).query;

        if (query) {
          const parsedQuery = new url.URLSearchParams(query);
          const subscribedEvents = parsedQuery.get('subscribe');

          const events = subscribedEvents ? subscribedEvents.split(',') : [];

          conn.subscribedEvents = events;
        } else {
          conn.subscribedEvents = [];
        }
      });
    }
  }

  getNumberOfOnlineUsers() {
    return WebSocketServer.wss.clients.size;
  }

  subscribeToOnlineUsers() {
    this.checkBrokenConnections();

    WebSocketServer.wss.addListener('connection', () => {
      this.currentActiveUsers = WebSocketServer.wss.clients.size;

      this.broadcast('online/users', { value: this.currentActiveUsers });
    });
  }

  checkBrokenConnections() {
    setInterval(() => {
      if (WebSocketServer.wss.clients.size !== this.currentActiveUsers) {
        this.currentActiveUsers = WebSocketServer.wss.clients.size;

        this.broadcast('online/users', { value: this.currentActiveUsers });
      }
    }, 3000);
  }

  broadcast(event: string, data: object) {
    WebSocketServer.wss.clients.forEach((client) => {
      const clientWithEvents = client as WebSocketWithEvents;

      if (
        clientWithEvents.subscribedEvents.includes(event) &&
        clientWithEvents.readyState === webSocket.OPEN
      ) {
        clientWithEvents.send(JSON.stringify({ event, data }));
      }
    });
  }
}
