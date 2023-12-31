export default {
  data() {
    return {
      lastScrollTop: 0,
      scrollTimeoutId: 0
    };
  },
  methods: {
    _onScroll(e) {
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

      const st = pageYOffset || scrollTop || (e && e.target.scrollTop) || 0;

      const diff = Math.abs(st - this.lastScrollTop);

      if (diff < 20) {
        return;
      }

      if (st > this.lastScrollTop) {
        if (st > height) {
          document.body.classList.add("scroll-top");
        }
        document.body.classList.remove("scroll-bottom");
      }
      //commented to fix shaking bug in mobile scrolling
      else {
        document.body.classList.remove("scroll-top");
        document.body.classList.add("scroll-bottom");
      }
      if (st <= 0) {
        document.body.classList.remove("scroll-bottom");
        document.body.classList.remove("scroll-top");
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    },
    onScroll(e) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = setTimeout(() => {
        this._onScroll(e);
      }, 100);
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
    this.onScroll();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  }
};
