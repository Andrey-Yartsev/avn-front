import Wsp from "@/ws/wsp";

export default {
  data: () => ({
    shouldMaintainConnection: false,
    alreadySended: ""
  }),
  methods: {
    getObservedIds() {
      const allIds = this.posts.map(p => p.id);
      const sended = this.alreadySended.split(",");
      const shouldBePosted = allIds.filter(
        id => sended.indexOf(`${id}`) === -1
      );
      return shouldBePosted.join(",");
    },
    connectWs() {
      this.wsp.connect(
        // onOpen
        () => {
          this.maintainСonnection();
        },
        // onClose
        () => {
          this.connectWs();
        }
      );
    },
    closeWs() {
      this.wsp.close();
    },
    maintainСonnection() {
      if (!this.wsp || !this.shouldMaintainConnection) return;
      this.wsp.ws.send("");
      setTimeout(() => this.maintainСonnection(), 20000);
    },
    stopMaintainСonnection() {
      this.shouldMaintainConnection = false;
    },
    sendObservedIds() {
      const ids = this.getObservedIds();
      if (!this.wsp || !ids.length) return;
      this.alreadySended = !this.alreadySended
        ? ids
        : `${this.alreadySended},${ids}`;
      this.wsp.ws.send(ids);
    }
  },
  created() {
    this.wsp = new Wsp(postId => {
      this.$store.dispatch("post/updatePost", { postId });
    });
    this.connectWs();
  },
  beforeDestroy() {
    this.stopMaintainСonnection();
    this.closeWs();
  },
  watch: {
    posts() {
      this.sendObservedIds();
    }
  }
};
