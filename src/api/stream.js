import tokenRequest from "@/utils/tokenRequest";

export default {
  getStreamPath(token) {
    return `${process.env.VUE_APP_API_URL}/streams/url?access-token=${token}`;
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
  deleteStream(streamId) {
    return tokenRequest(`streams/${streamId}`, {
      method: "DELETE"
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
