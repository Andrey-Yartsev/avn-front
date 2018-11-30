import Store from "@/store";
import Fingerprint from "fingerprintjs2";
import moment from "moment";

import stream from "./actions/stream";
import stream_stop from "./actions/stream_stop";
import chats from "./actions/chats";
import new_notification from "./actions/new_notification";
import payoutsApproved from "./actions/payoutsApproved";
import subscription from "./actions/subscription";
import tip from "./actions/tip";
import message from "./actions/message";

const actions = {
  chats,
  new_notification,
  payoutsApproved,
  subscription,
  tip,
  stream,
  stream_stop,
  message
};

export default class {
  start(reconnect) {
    if (reconnect) {
      console.log("ws reconnected");
    } else {
      console.log("ws connected");
    }
    const tz = moment().format("ZZ");
    const ws = new WebSocket(process.env.VUE_APP_WS_URL);
    this.ws = ws;
    ws.onopen = () => {
      new Fingerprint({ excludeWebGL: true, excludeCanvas: true }).get(fp => {
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
    ws.onmessage = r => {
      const data = JSON.parse(r.data);
      console.log("ws:", data);
      const keys = Object.keys(data);
      for (let key of keys) {
        if (actions[key]) {
          actions[key](data[key]);
        }
      }
    };
    ws.onclose = () => {
      setTimeout(() => {
        if (!this.doNotReconnect) {
          this.start(true);
        }
      }, 5000);
    };
  }
  connect() {
    this.doNotReconnect = false;
    this.start();
  }
  close() {
    this.doNotReconnect = true;
    // console.log("ws disconnected");
    this.ws.close();
  }
}
