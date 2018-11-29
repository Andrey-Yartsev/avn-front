import Store from "@/store";
import Fingerprint from "fingerprintjs2";
import moment from "moment";

import uploadMedia from "./actions/uploadMedia";

const actions = {
  uploadMedia
};

export default () => {
  let ws;
  const start = () => {
    const tz = moment().format("ZZ");
    ws = new WebSocket(process.env.VUE_APP_WSP_URL);
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
      // console.log(data);
      const keys = Object.keys(data);
      for (let key of keys) {
        if (actions[key]) {
          actions[key](data[key]);
        }
      }
    };
    ws.onclose = function() {
      setTimeout(start, 5000);
    };
  };
  start();

  setInterval(() => {
    if (!ws) return;
    ws.send(
      JSON.stringify({
        time: Date.now()
      })
    );
  }, 20000);
};
