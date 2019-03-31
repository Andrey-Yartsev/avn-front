import { EventEmitter } from "events";
import moment from "moment";
import Fingerprint from "fingerprintjs2";

import Store from "@/store";

const isOffline = () => {
  return global.navigator && global.navigator.onLine === false;
};

export default class Ws extends EventEmitter {
  constructor(actions, type) {
    super();
    this.type = type || "ws";
    this.actions = actions;
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
    if (this.type && this.type === "wsg") {
      ws = new WebSocket(Store.state.init.data.websocket.guest);
    } else {
      ws = new WebSocket(Store.state.init.data.websocket.general);
    }
    this.ws = ws;

    ws.onopen = () => {
      this.connected = true;
      this.connecting = false;
      this.clearQueue();
      Fingerprint.getV18({}, fp => {
        ws.send(
          JSON.stringify({
            sess: Store.state.auth.token,
            act: "connect",
            fp,
            tz
          })
        );
        this.emit("connect");
      });
    };
    ws.onmessage = r => {
      const data = JSON.parse(r.data);
      if (data.payoutsApproved !== undefined) {
        this.actions.payoutsLegalResult(data);
        return;
      }
      this.emit("message", data);
      // console.log("ws:", data);
      const keys = Object.keys(data);
      for (let key of keys) {
        if (this.actions[key]) {
          this.actions[key](data[key]);
        }
      }
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
  }
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
  send(data) {
    const message = { ...data, sess: Store.state.auth.token };
    if (!this.connected || this.connecting || isOffline()) {
      console.log(
        this.type + " not connected. Can't send " + JSON.stringify(data)
      );
      this.queue.push(message);
    }

    if (!this.connected || this.connecting) {
      return;
    }

    this.ws.send(JSON.stringify(message));
  }
  clearQueue() {
    if (this.connected && this.queue.length) {
      this.queue.forEach(message => {
        this.ws.send(JSON.stringify(message));
      });
      this.queue = [];
    }
  }
}
