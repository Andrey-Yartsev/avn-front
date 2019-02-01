import { EventEmitter } from "events";
import moment from "moment";
import Fingerprint from "fingerprintjs2";

import Store from "@/store";

export default class Ws extends EventEmitter {
  constructor(actions, type) {
    super();
    this.type = type || "ws";
    this.actions = actions;
    this.doNotReconnect = false;
  }
  start(reconnect) {
    this.connecting = true;
    if (reconnect) {
      console.log(this.type + " reconnected");
    } else {
      console.log(this.type + " connected");
    }
    const tz = moment().format("ZZ");
    let ws;
    if (this.type && this.type === "wsg") {
      ws = new WebSocket(process.env.VUE_APP_WSG_URL);
    } else {
      ws = new WebSocket(process.env.VUE_APP_WS_URL);
    }
    this.ws = ws;

    ws.onopen = () => {
      this.connected = true;
      this.connecting = false;
      new Fingerprint({ excludeWebGL: true, excludeCanvas: true }).get(fp => {
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
    this.doNotReconnect = true;
    this.ws.close();
  }
  send(data) {
    data.sess = Store.state.auth.token;
    this.ws.send(JSON.stringify(data));
  }
}
