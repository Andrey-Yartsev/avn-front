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
      const isOnBottom = getBottom();
      if (isOnBottom && !loading && !allDataReceived) {
        this.infinityScrollGetDataMethod();
      }
    }
  }
};
