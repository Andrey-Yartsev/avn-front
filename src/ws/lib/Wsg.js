import WsAbstract from "./WsAbstract";

import stream from "./actions-g/stream";
import stream_stop from "./actions-g/stream_stop";
import stream_look from "./actions-g/stream_look";
import stream_unlook from "./actions-g/stream_unlook";

const actions = {
  stream,
  stream_stop,
  stream_look,
  stream_unlook
};

export default class Ws extends WsAbstract {
  constructor() {
    super("wsg");
    this.actions = actions;
  }
  onData(data) {
    this.emit("message", data);
    console.log("wsg:", data);
    const keys = Object.keys(data);
    for (let key of keys) {
      if (this.actions[key]) {
        this.actions[key](data[key]);
      }
    }
  }
}
