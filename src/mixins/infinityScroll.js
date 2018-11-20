import { getBottom } from "@/helpers/page";

export default {
  data() {
    return {
      infinityScrollTimeout: false,
      lastYOffset: 0
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onScrollHandler, true);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScrollHandler, true);
  },
  methods: {
    onScrollHandler: function() {
      if (this.infinityScrollTimeoutId) {
        clearTimeout(this.infinityScrollTimeoutId);
      }

      this.infinityScrollTimeoutId = setTimeout(() => {
        if (window.pageYOffset < this.lastYOffset) {
          return;
        }
        this.lastYOffset = window.pageYOffset;

        const { loading, allDataReceived } = this.store;
        const isLoading = this.loadingName
          ? this.store[this.loadingName]
          : loading;

        const isOnBottom = getBottom();
        if (isOnBottom && !isLoading && !allDataReceived) {
          this.infinityScrollGetDataMethod();
        }
      }, 100);
    }
  }
};
