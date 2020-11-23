import { getBottom } from "@/helpers/page";

export default {
  data() {
    return {
      infinityScrollTimeout: false,
      lastYOffset: 0
    };
  },
  computed: {
    infinityScrollLoading() {
      if (!this.store) {
        return;
        // throw new Error(
        //   `this.store is not defined in component ${
        //     this.$options.name
        //   } using mixin inifinityScroll`
        // );
      }
      const { loading } = this.store;
      const isLoading = this.loadingName
        ? this.store[this.loadingName]
        : loading;

      return isLoading;
    },
    allDataReceived() {
      return this.store.allDataReceived;
    }
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

        const isOnBottom = getBottom();
        if (
          isOnBottom &&
          !this.infinityScrollLoading &&
          !this.allDataReceived
        ) {
          this.infinityScrollGetDataMethod();
        }
      }, 100);
    },
    resetInfinityScroll() {
      this.lastYOffset = 0;
    }
  }
};
