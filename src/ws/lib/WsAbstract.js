import { EventEmitter } from "events";
import { format } from "date-fns";
import Fingerprint from "fingerprintjs2";
import Store from "@/store";
import Logger from "js-logger";

const isOffline = () => {
  return global.navigator && global.navigator.onLine === false;
};

const logger = Logger.get("ws");

export default class Ws extends EventEmitter {
  constructor(type) {
    super();
    this.forcedClose = false;
    this.type = type;
    this.doNotReconnect = false;
    this.queue = [];
  }
  start(reconnect) {
    this.connecting = true;
    const tz = format(new Date(), "XX");
    let ws;

    if (this.type === "ws") {
      ws = new WebSocket(Store.state.init.data.websocket.general);
    } else if (this.type === "wsp") {
      ws = new WebSocket(Store.state.init.data.websocket.posts);
    } else {
      if (!Store.state.init.data) {
        ws = new WebSocket("wss://ws.stars.avn.com/wsg/");
      } else {
        ws = new WebSocket(Store.state.init.data.websocket.guest);
      }
    }
    this.ws = ws;

    ws.onopen = () => {
      this.connecting = false;
      Fingerprint.getV18({}, fp => {
        ws.send(
          JSON.stringify({
            sess: Store.state.auth.token,
            act: "connect",
            fp,
            tz
          })
        );
      });
    };

    ws.onclose = () => {
      this.connected = false;
      this.connecting = false;
      logger.info(
        this.type + " disconnected" + (this.forcedClose ? " (forced)" : "")
      );

      if (!this.forcedClose) {
        setTimeout(() => {
          if (!this.doNotReconnect) {
            this.start(true);
          }
        }, 5000);
      }

      this.forcedClose = false;
    };

    this.ws.onmessage = r => {
      const data = JSON.parse(r.data);
      if (data.userConnected) {
        if (reconnect) {
          logger.info(this.type + " reconnected");
        } else {
          logger.info(this.type + " connected");
        }
        this.connected = true;
        this.clearQueue();
        this.emit("connect");
      }
      this.onData(data);
    };
  }
  // Abstract method
  // onData(data) {}
  connect() {
    if (this.connected || this.connecting) {
      return;
    }
    this.doNotReconnect = false;
    this.start();
  }
  close() {
    this.connected = false;
    this.doNotReconnect = true;
    this.forcedClose = true;
    this.ws.close();
  }
  maintainConnection() {
    this.ws.send("");
    setTimeout(() => this.maintainConnection(), 20000);
  }
  addedToQueue(data) {
    if (!this.connected || isOffline()) {
      logger.info(this.type + " not connected. Added to queue " + data);
      this.queue.push(data);
      return true;
    }
    return false;
  }
  send(data) {
    if (this.addedToQueue(data)) {
      return;
    }
    this._send(data);
  }
  _send(data) {
    logger.info("Sending", data);
    this.ws.send(JSON.stringify(data));
  }
  clearQueue() {
    if (this.connected && this.queue.length) {
      this.queue.forEach(data => {
        logger.info("Sending from queue:", data);
        this.ws.send(data);
      });
      this.queue = [];
    }
  }
}
