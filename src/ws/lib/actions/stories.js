import Store from "@/store";

export default stories => {
  stories.forEach(story => {
    Store.dispatch("stories/extendPost", story);
  });
};
