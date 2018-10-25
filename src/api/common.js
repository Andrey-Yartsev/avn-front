import anyRequest from "@/utils/anyRequest";

export default {
  getPages() {
    return anyRequest("pages", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
  }
};
