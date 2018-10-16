import Store from "@/store";
import Fingerprint from "fingerprintjs2";
import moment from "moment";

import chats from "./actions/chats";
import new_notification from "./actions/new_notification";

const actions = {
  chats,
  new_notification
};

export default () => {
  const tz = moment().format("ZZ");
  const ws = new WebSocket(process.env.VUE_APP_WS_URL);
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
    const keys = Object.keys(data);
    for (let key of keys) {
      if (actions[key]) {
        actions[key](data[key]);
      }
    }
  };
};
