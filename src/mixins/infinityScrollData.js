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
        throw new Error(
          "this.store is not defined in component using mixin inifinityScroll"
        );
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
  }
};
