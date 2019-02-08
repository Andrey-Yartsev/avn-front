import anyRequest from "@/utils/anyRequest";

export default {
  getContent({ source }) {
    return anyRequest(`pages/${source}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
  }
};
