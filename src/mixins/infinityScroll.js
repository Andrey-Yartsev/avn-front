import { getBottom } from "@/helpers/page";

export default {
  mounted() {
    window.addEventListener("scroll", this.onScrollHandler, true);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScrollHandler, true);
  },
  methods: {
    onScrollHandler: function() {
      const { loading, allDataReceived } = this.store;
      const isLoading = this.loadingName
        ? this.store[this.loadingName]
        : loading;
      const isOnBottom = getBottom();
      if (isOnBottom && !isLoading && !allDataReceived) {
        this.infinityScrollGetDataMethod();
      }
    }
  }
};
