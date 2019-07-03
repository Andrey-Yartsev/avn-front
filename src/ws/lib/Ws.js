import Store from "@/store";
import WsAbstract from "./WsAbstract";

import stream from "./actions/stream";
import stream_public from "./actions/stream_public";
import stream_stop from "./actions/stream_stop";
import stream_look from "./actions/stream_look";
import stream_like from "./actions/stream_like";
import stream_unlook from "./actions/stream_unlook";
import stream_tip from "./actions/stream_tip";
import stream_comment from "./actions/stream_comment";
import statistics from "./actions/statistics";
import chats from "./actions/chats";
import new_notification from "./actions/new_notification";
import payoutsLegalResult from "./actions/payoutsLegalResult";
import subscription from "./actions/subscription";
import tip from "./actions/tip";
import message from "./actions/message";
import new_feed_post from "./actions/new_feed_post";

const actions = {
  chats,
  new_notification,
  payoutsLegalResult,
  subscription,
  tip,
  stream,
  stream_stop,
  stream_look,
  stream_like,
  stream_unlook,
  stream_tip,
  message,
  stream_comment,
  statistics,
  new_feed_post,
  stream_public
};

export default class Ws extends WsAbstract {
  constructor() {
    super("ws");
    this.actions = actions;
  }
  onData(data) {
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
  }
  send(data) {
    data = { ...data, sess: Store.state.auth.token };
    super.send(data);
  }
}
