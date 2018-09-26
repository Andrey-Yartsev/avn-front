import tokenRequest from "@/utils/tokenRequest";

export default {
  getPages() {
    return tokenRequest("pages", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
  }
};
