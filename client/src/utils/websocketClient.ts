class WebSocketClient {
  // Allowing only one websocket connection per page/at any instance.
  private static websocketClientSingleton: WebSocket | null = null;
  private retries: number;
  private maxRetries: number;
  private url: string;

  connect() {
    WebSocketClient.websocketClientSingleton = new WebSocket(this.url);

    WebSocketClient.websocketClientSingleton.onopen = () => {
      console.log('WebSocket connected');
      this.retries = 0;
    };

    WebSocketClient.websocketClientSingleton.onerror = () => {
      console.error('WebSocket connection error');
      this.retries++;
      if (this.retries <= this.maxRetries) {
        setTimeout(() => {
          console.log('Retrying WebSocket connection...');
          this.connect();
        }, 5000);
      } else {
        console.error('Maximum number of retries reached');
      }
    };
  }

  constructor(url) {
    if (!WebSocketClient.websocketClientSingleton) {
      this.url = url;
      this.maxRetries = 5;
      this.retries = 0;
      this.connect();
    }
  }

  getInstance() {
    return WebSocketClient.websocketClientSingleton;
  }

  terminate() {
    WebSocketClient.websocketClientSingleton.close();
    WebSocketClient.websocketClientSingleton = null;
  }
}

export default WebSocketClient;
