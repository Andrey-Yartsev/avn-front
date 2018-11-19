import request from "@/utils/request";
import tokenRequest from "@/utils/tokenRequest";
import Store from "@/store";

export default {
  signUp(data) {
    return request("users/register", {
      method: "POST",
      data
    });
  },
  fetch() {
    return tokenRequest("users/me", {
      method: "GET"
    });
  },
  login(data) {
    return new Promise(async (resolve, reject) => {
      let response = await request("users/login", {
        method: "POST",
        data
      });
      response = await response.json();
      if (response.error) {
        reject(response.error);
      }
      resolve(response);
    });
  },
  async logout() {
    await tokenRequest("sessions/" + Store.state.auth.token, {
      method: "DELETE"
    });
  },
  update(user) {
    return tokenRequest("users/me", {
      method: "PUT",
      data: user
    });
  },
  getPosts({ userId, offset, limit, marker, source }) {
    return tokenRequest(`users/${userId}/posts/${source}`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  }
};
