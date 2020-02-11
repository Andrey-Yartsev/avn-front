import StreamApi from "@/api/stream";
import User from "@/mixins/user";

export default {
  mixins: [User],
  methods: {
    async shouldBeUpdated(stream) {
      const r = await StreamApi.needSubscribeOrFollow(stream.id);
      if (r) {
        if (r === 1 || r === 2) {
          throw new Error();
        }
        return true;
      }
      return true;
    },
    async tryOpenStream(streamer, stream, onSuccess) {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      const r = await StreamApi.needSubscribeOrFollow(stream.id);
      if (r) {
        if (r === 1) {
          this.$store.dispatch("modal/show", {
            name: "subscribe",
            data: {
              user: streamer
            }
          });
        } else if (r === 2) {
          this.$store.dispatch("modal/show", {
            name: "confirm",
            data: {
              text: `You need to be a ${
                streamer.name
              }'s follower to watch stream. Do you want to follow?`,
              success: () => {
                this.$store
                  .dispatch(`profile/home/follow`, streamer.id)
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
