import { EventEmitter } from "events";
import moment from "moment";
import Fingerprint from "fingerprintjs2";
import Store from "@/store";

const isOffline = () => {
  return global.navigator && global.navigator.onLine === false;
};

export default class Ws extends EventEmitter {
  constructor(type) {
    super();
    this.type = type;
    this.doNotReconnect = false;
    this.queue = [];
  }
  start(/* reconnect */) {
    this.connecting = true;
    // if (reconnect) {
    //   console.log(this.type + " reconnected");
    // } else {
    //   console.log(this.type + " connected");
    // }
    const tz = moment().format("ZZ");
    let ws;
    if (this.type === "ws") {
      ws = new WebSocket(Store.state.init.data.websocket.general);
    } else if (this.type === "wsp") {
      ws = new WebSocket(Store.state.init.data.websocket.posts);
    } else {
      ws = new WebSocket(Store.state.init.data.websocket.guest);
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
      setTimeout(() => {
        if (!this.doNotReconnect) {
          this.start(true);
        }
      }, 5000);
    };

    this.ws.onmessage = r => {
      const data = JSON.parse(r.data);
      if (data.userConnected) {
        // console.log(this.type + " connected");
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
    this.ws.close();
    // console.log(this.type + " disconnected");
  }
  maintainConnection() {
    this.ws.send("");
    setTimeout(() => this.maintainConnection(), 20000);
  }
  addedToQueue(data) {
    if (!this.connected || isOffline()) {
      // console.log(this.type + " not connected. Added to queue " + data);
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
    this.ws.send(JSON.stringify(data));
  }
  clearQueue() {
    if (this.connected && this.queue.length) {
      this.queue.forEach(data => {
        // console.log("Sending from queue:", data);
        this.ws.send(data);
      });
      this.queue = [];
    }
  }
}
