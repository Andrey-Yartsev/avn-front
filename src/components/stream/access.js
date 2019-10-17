import StreamApi from "@/api/stream";

export default {
  methods: {
    async tryOpenStream(user, stream, onSuccess) {
      const r = await StreamApi.needSubscribeOrFollow(stream.id);
      if (r) {
        if (r === 1) {
          this.$store.dispatch("modal/show", {
            name: "subscribe",
            data: {
              user: this.user
            }
          });
        } else if (r === 2) {
          this.$store.dispatch("modal/show", {
            name: "confirm",
            data: {
              text: `You need to be a ${
                user.name
              }'s follower to watch stream. Do you want to follow?`,
              success: () => {
                this.$store
                  .dispatch(`profile/home/follow`, user.id)
                  .then(() => {
                    onSuccess(stream);
                  });
              }
            }
          });
        }
        return;
      }

      onSuccess(stream);
    },
    openStream(stream) {
      this.$store.dispatch("modal/show", {
        name: "stream",
        data: {
          stream
        }
      });
    }
  }
};
