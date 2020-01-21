export default {
  data() {
    return {
      observer: null
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
          if (entry.isIntersecting && !this.allDataRecieved) {
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
      const target = this.$refs.scrollObserver;
      if (target && this.observer) {
        this.observer.unobserve(target);
      }
      this.initIntersectionObserver(cb);
    }
  },
  beforeDestroy() {
    const target = this.$refs.scrollObserver;
    if (target && this.observer) {
      this.observer.unobserve(target);
    }
  }
};
