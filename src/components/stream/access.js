import StreamApi from "@/api/stream";
import User from "@/mixins/user";
import PayAction from "@/components/pages/settings/payments/payAction";

export default {
  mixins: [User, PayAction],
  methods: {
    async tryOpenStream(streamer, stream, onSuccess) {
      if (!this.user) {
        this.$store.dispatch("modal/show", { name: "login" });
        return;
      }
      const r = await StreamApi.needSubscribeOrFollow(stream.id);
      if (r) {
        switch (r) {
          case 1:
            this.$store.dispatch("modal/show", {
              name: "subscribe",
              data: {
                user: streamer
              }
            });
            break;
          case 2:
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
            break;
          case 3:
            this.$store.dispatch("modal/show", {
              name: "confirm",
              data: {
                text: `You have to renew your membership. Do you want to renew for free?`,
                success: () => {
                  this.$store
                    .dispatch("profile/groups/joinGroup", {
                      productId: stream.listOptions.listId,
                      showMembers: false
                    })
                    .then(() => {
                      onSuccess(stream);
                    });
                }
              }
            });
            break;
          case 4:
            this.$store.dispatch("modal/show", {
              name: "confirm",
              data: {
                text: `You have to join to the group for $${
                  stream.listOptions.price
                } to watch the stream. Do you want to join?`,
                success: () => {
                  this._pay(
                    {
                      paymentType: "list",
                      productId: stream.listOptions.listId,
                      amount: parseFloat(stream.listOptions.price),
                      points: 1,
                      paymentGateCustomerCardToken: this.user
                        .paymentGateCustomerCardToken
                    },
                    () => {
                      this.$store
                        .dispatch("profile/groups/joinGroup", {
                          productId: stream.listOptions.listId,
                          showMembers: false
                        })
                        .then(() => {
                          onSuccess(stream);
                        });
                    }
                  );
                }
              }
            });
            break;
          case 5:
            this.$store.dispatch("global/flashToast", {
              text: "This is a private live stream",
              type: "warning"
            });
            break;
          case 6:
            this.$store.dispatch("global/flashToast", {
              text: "The stream is not available for AVN Stars",
              type: "warning"
            });
            break;
          default:
            break;
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
