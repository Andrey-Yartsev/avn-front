import request from "@/utils/request";
import tokenRequest from "@/utils/tokenRequest";
import anyRequest from "@/utils/anyRequest";
import Store from "@/store";

export default {
  signUp(data) {
    data.userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
    data.userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
  logout() {
    return tokenRequest("sessions/" + Store.state.auth.token, {
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
    return anyRequest(`users/${userId}/posts/${source}`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  },
  getLinks(userId) {
    return anyRequest(`links/${userId}`, {
      method: "GET"
    });
  },
  postLink(data) {
    return tokenRequest(`links`, {
      method: "POST",
      data: data
    });
  },
  updateLink(data) {
    return tokenRequest(`links/${data.id}`, {
      method: "PUT",
      data: data
    });
  },
  deleteLink(id) {
    return tokenRequest(`links/${id}`, {
      method: "DELETE"
    });
  }
};
