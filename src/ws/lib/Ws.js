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
import stream_goal from "./actions/stream_goal";
import statistics from "./actions/statistics";
import chats from "./actions/chats";
import new_notification from "./actions/new_notification";
import payoutsLegalResult from "./actions/payoutsLegalResult";
import payoutsReset from "./actions/payoutsReset";
import subscription from "./actions/subscription";
import tip from "./actions/tip";
import message from "./actions/message";
import new_feed_post from "./actions/new_feed_post";
import online from "./actions/online";
import typing from "./actions/typing";
import stories from "./actions/stories";
import header_stream from "./actions/header_stream";
import updatedCreditBalance from "./actions/updatedCreditBalance";
import newCardToken from "./actions/newCardToken";
import contests from "./actions/contests";
import groups from "./actions/groups";
import blockedWithPrice from "./actions/blockedWithPrice";
import unblockedWithPrice from "./actions/unblockedWithPrice";
import check_new_email from "./actions/check_new_email";
import check_new_username from "./actions/check_new_username";
import deleteMessage from "./actions/deleteMessage";
import editMessage from "./actions/editMessage";
import voting from "./actions/voting";

const actions = {
  chats,
  new_notification,
  payoutsLegalResult,
  payoutsReset,
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
  stream_goal,
  statistics,
  new_feed_post,
  stream_public,
  online,
  typing,
  stories,
  header_stream,
  updatedCreditBalance,
  newCardToken,
  contests,
  groups,
  blockedWithPrice,
  unblockedWithPrice,
  check_new_email,
  check_new_username,
  deleteMessage,
  editMessage,
  voting
};

export default class Ws extends WsAbstract {
  constructor() {
    super("ws");
    this.actions = actions;
  }
  onData(data) {
    if (data.reload) {
      if (
        data.type === "video" ||
        data.type === "photo" ||
        data.type === "audio"
      ) {
        this.emit("reloadMedia", data);
        return;
      } else {
        this.emit("reloadPost", data.post_id);
        return;
      }
    }
    if (data.type === "mediaVideoPreview") {
      this.emit("reloadMediaPreview", data);
      return;
    }
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
