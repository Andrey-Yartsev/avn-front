import User from "@/mixins/user";

export default {
  mixins: [User],
  computed: {
    kindOptions() {
      const options = [];
      if (this.user.categoryView === 1 || this.user.categoryView === 2) {
        options.push({
          title: "AVN Magazine",
          name: "avn"
        });
      }
      if (this.user.categoryView === 1 || this.user.categoryView === 3) {
        options.push({
          title: "GayVN Magazine",
          name: "gay"
        });
      }
      return options;
    }
  }
};
