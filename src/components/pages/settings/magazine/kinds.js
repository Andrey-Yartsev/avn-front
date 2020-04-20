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
      console.log(">>>", this.user.categoryView);
      if (this.user.categoryView === 1 || this.user.categoryView === 3) {
        console.log("XXX");
        options.push({
          title: "GayVN Magazine",
          name: "gay"
        });
      }
      return options;
    }
  }
};
