import WsAbstract from "./WsAbstract";

import stream from "./actions/stream";
import stream_public from "./actions/stream_public";
import stream_stop from "./actions/stream_stop";
import stream_look from "./actions/stream_look";
import stream_unlook from "./actions/stream_unlook";
import stream_comment from "./actions/stream_comment";
import stream_goal from "./actions/stream_goal";

import Logger from "js-logger";

const logger = Logger.get("ws");

const actions = {
  stream_public,
  stream,
  stream_stop,
  stream_comment,
  stream_look,
  stream_unlook,
  stream_goal
};

export default class Ws extends WsAbstract {
  constructor() {
    super("wsg");
    this.actions = actions;
  }
  onData(data) {
    this.emit("message", data);
    logger.info("wsg:", data);
    const keys = Object.keys(data);
    for (let key of keys) {
      if (this.actions[key]) {
        this.actions[key](data[key]);
      }
    }
  }
}
