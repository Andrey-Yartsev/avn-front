export default {
  data() {
    return {
      lastScrollTop: 0
    };
  },
  methods: {
    onScroll(e) {
      const { scrollTop } = document.documentElement;
      const { pageYOffset } = window;
      const mainHeader = this.$refs.siteHeader;
      const notifHeader = document.querySelector(
        ".notifications-header.main-header"
      );
      const chatHeader = document.querySelector(".contactsListHeader");

      let height = 44;
      if (mainHeader) {
        height = mainHeader.getBoundingClientRect().height;
      }

      if (notifHeader) {
        height = notifHeader.getBoundingClientRect().height;
      }

      if (chatHeader) {
        height = chatHeader.getBoundingClientRect().height;
      }

      const st = pageYOffset || scrollTop || e.target.scrollTop;

      if (st > this.lastScrollTop) {
        if (st > height) {
          document.body.classList.add("scroll-top");
        }
        document.body.classList.remove("scroll-bottom");
      } else {
        document.body.classList.remove("scroll-top");
        document.body.classList.add("scroll-bottom");
      }
      if (st <= 0) {
        document.body.classList.remove("scroll-bottom");
        document.body.classList.remove("scroll-top");
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  }
};
