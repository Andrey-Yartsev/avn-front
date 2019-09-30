import tokenRequest from "@/utils/tokenRequest";
import Store from "@/store";

export default {
  getStreamPath(token) {
    return `${process.env.VUE_APP_API_URL}/streams/url?access-token=${token}`;
  },
  async needSubscribe(id) {
    const token = Store.state.auth.token;
    const r = await fetch(this.getStreamClientPath(id, token));

    if (r.status === 400) {
      return true;
    }
    return false;
  },
  getStreamClientPath(id, token) {
    return `${
      process.env.VUE_APP_API_URL
    }/streams/${id}/url?access-token=${token}`;
  },
  runStream(data) {
    return tokenRequest(`streams`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  },
  deleteStream(streamId = "") {
    return tokenRequest(`streams/${streamId}`, {
      method: "DELETE"
    });
  },
  checkActive() {
    return tokenRequest(`streams/has-active`, {
      method: "GET"
    });
  },
  saveStream(streamId, haveToSaveComments) {
    return tokenRequest(`streams/${streamId}/save-video`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        keepComments: !!haveToSaveComments
      })
    });
  }
};
