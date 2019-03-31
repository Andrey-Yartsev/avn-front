import Ws from "./lib/Ws";

import stream from "./actions/stream";
import stream_stop from "./actions/stream_stop";
import stream_look from "./actions/stream_look";
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
  stream_unlook,
  stream_tip,
  message,
  stream_comment,
  statistics,
  new_feed_post
};

const ws = new Ws(actions);

export default ws;
