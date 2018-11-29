import Store from "@/store";
import Fingerprint from "fingerprintjs2";
import moment from "moment";

function Wsp(reloadAction) {
  this.ws = undefined;
  this.reloadAction = reloadAction;
}

Wsp.prototype.connect = function(openCallback, closeCallback) {
  const tz = moment().format("ZZ");
  this.ws = new WebSocket(process.env.VUE_APP_WSP_URL);
  this.ws.onopen = () => {
    new Fingerprint({ excludeWebGL: true, excludeCanvas: true }).get(fp => {
      this.ws.send(
        JSON.stringify({
          sess: Store.state.auth.token,
          act: "connect",
          fp,
          tz
        })
      );
    });
    typeof openCallback === "function" && openCallback();
  };

  this.ws.onmessage = r => {
    const data = JSON.parse(r.data);
    if (data.reload) {
      this.reloadAction(data.post_id);
    }
  };

  this.ws.onclose = function() {
    typeof closeCallback === "function" && closeCallback();
  };
};

Wsp.prototype.close = function() {
  this.ws.onclose = null;
  this.ws.close();
};

export default Wsp;
