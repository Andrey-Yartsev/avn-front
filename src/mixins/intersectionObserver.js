export default {
  data() {
    return {
      observer: null,
      isInitFetch: true
    };
  },
  watch: {
    allDataRecieved(newValue) {
      if (newValue) {
        const target = this.$refs.scrollObserver;
        if (target && this.observer) {
          this.observer.unobserve(target);
        }
      }
    }
  },
  methods: {
    initIntersectionObserver(cb) {
      const callback = entries => {
        entries.forEach(entry => {
          if (
            entry.isIntersecting &&
            !this.allDataRecieved &&
            !this.isInitFetch
          ) {
            console.log("load more");
            cb();
          }
        });
      };
      this.observer = new IntersectionObserver(callback);
      const target = this.$refs.scrollObserver;
      if (target) {
        this.observer.observe(target);
      }
    },
    handleResponseWithIntersectionObserver(cb) {
      this.destroyObserver();
      this.initIntersectionObserver(cb);
    },
    destroyObserver() {
      const target = this.$refs.scrollObserver;
      if (target && this.observer) {
        this.observer.unobserve(target);
      }
    }
  },
  beforeDestroy() {
    this.destroyObserver();
  }
};
