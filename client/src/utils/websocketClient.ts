class WebSocketClient {
  private static websocketClientSingleton: WebSocket | null = null;

  constructor(url) {
    if (!WebSocketClient.websocketClientSingleton) {
      WebSocketClient.websocketClientSingleton = new WebSocket(url);
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
