import Goto from "@/mixins/modalRouter/goto.js";

export default {
  mixins: [Goto],
  methods: {
    initPostText(el) {
      el.getElementsByTagName("a").forEach(a => {
        console.log(a.href);
      });
    },
    openModal(id) {
      this.goToModalRoute(`post/${id}`);
    }
  }
};
