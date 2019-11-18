export default {
  data() {
    return {
      visibilityIdTimeout: 0,
      visibilityIndexes: [],
      isVisibleIndexes: []
    };
  },
  methods: {
    storePrefix() {
      throw new Error("You need to specify storePrefix() method");
    },
    visibilityChanged({ isVisible, id }) {
      if (isVisible) {
        let index = this.posts.findIndex(post => post.id === id);
        this.visibilityIndexes.push(index);
        clearTimeout(this.visibilityIdTimeout);
        this.visibilityIdTimeout = setTimeout(
          this.visibilityFinishCollect,
          100
        );
      }
    },
    visibilityFinishCollect() {
      const averageIndex = this.getVisibilityAverage();
      let from = averageIndex - 4;
      let to = averageIndex + 4;
      this.visibilityIndexes = [];
      this.isVisibleIndexes = [];
      if (from < 0) {
        from = 0;
      }
      if (to > this.posts.length - 1) {
        to = this.posts.length - 1;
      }
      for (let i = from; i <= to; i++) {
        this.isVisibleIndexes.push(i);
      }
      const items = [];
      for (let i = 0; i < this.posts.length; i++) {
        items.push({
          index: i,
          isVisible: this.isVisibleIndexes.indexOf(i) !== -1
        });
      }
      this.$store.commit(this.storePrefix() + "/updateVisibility", items);
    },
    getVisibilityAverage() {
      let r = this.visibilityIndexes.reduce((a, b) => a + b, 0);
      r = r / this.visibilityIndexes.length;
      r = Math.round(r);
      return r;
    }
  }
};
