import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  mixins: [ModalRouterGoto],
  computed: {
    userIds() {
      return this.stories.map(s => s.user.id);
    }
  },
  props: {
    stories: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    go() {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }

      const id = this.post.user.id;
      const userIds = [...this.userIds];
      const index = userIds.indexOf(id);

      this.$store.dispatch("common/setStoryList", {
        storyList: userIds.slice(index + 1, userIds.length)
      });

      this.goToModalRoute(`/stories/${id}`);
    }
  }
};
