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
        } else if (r === 3) {
          if (stream.listOptions?.listType === "private") {
            this.$store.dispatch("global/flashToast", {
              text: "This is a private live stream",
              type: "warning"
            });
            return;
          } else if (stream.listOptions?.listType === "public") {
            const text = stream.listOptions.canRenew
              ? `You have to renew your membership. Do you want to renew for free?`
              : `You have to join to the group for $${
                  stream.listOptions.price
                } to watch the stream. Do you want to join?`;
            this.$store.dispatch("modal/show", {
              name: "confirm",
              data: {
                text,
                success: () => {
                  if (stream.listOptions.canRenew) {
                    this.$store
                      .dispatch("profile/groups/joinGroup", {
                        productId: stream.listOptions.listId,
                        showMembers: false
                      })
                      .then(() => {
                        onSuccess(stream);
                      });
                  } else {
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
              }
            });
          }
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
