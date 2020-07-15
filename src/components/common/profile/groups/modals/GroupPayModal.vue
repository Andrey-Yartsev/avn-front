<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <div class="loader-container loader-container_center" v-if="progress">
          <Loader :fullscreen="false" text="" :small="true" />
        </div>
        <template v-else>
          <div class="popup-alert__title">
            {{ getTextTitle }}
          </div>
          <div class="popup-alert__body">
            <span v-if="dataModal.renew">
              You are renew the membership for free
            </span>
            <template v-else>
              <label
                v-for="v in payOptions"
                class="form-group-inner"
                :class="{ 'no-border-line': $mq === 'mobile' }"
                :key="v.points"
              >
                <div class="radio-wrapper icn-item">
                  <input
                    type="radio"
                    name="fee"
                    :value="v.points"
                    v-model="points"
                  />
                  <span class="label"
                    >${{ v.totalPrice }}
                    <span v-if="v.points == 1 && dataModal.join"
                      >(Minimum membersip fee)</span
                    ></span
                  >
                </div>
              </label>
            </template>
          </div>
          <div class="popup-alert__footer">
            <button class="btn" @click.prevent="yes">Confirm</button>
            <button class="btn alt" @click.prevent="no">Cancel</button>
          </div>
        </template>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import PayAction from "@/components/pages/settings/payments/payAction";
import Loader from "@/components/common/Loader";

export default {
  name: "GroupPayModal",
  mixins: [PayAction],
  components: {
    Modal,
    Loader
  },
  data() {
    return {
      points: 1
    };
  },
  computed: {
    dataModal() {
      return this.$store.state.modal.groupPayConfirm.data;
    },
    getTextTitle() {
      if (this.dataModal.join) {
        return this.dataModal.renew ? "Renew the membership" : "Pay to join";
      }
      return "Send fee";
    },
    // getTextDescription() {
    //   let str;
    //   if (this.dataModal.join) {
    //     str = this.dataModal.renew
    //       ? `renew the membership for free`
    //       : `joining to the group for $${this.dataModal.price}`;
    //   } else {
    //     str = `sending the fee $${this.dataModal.price}`;
    //   }
    //   return `You are ${str}`;
    // },
    payOptions() {
      return [1, 2, 3, 4].map(item => {
        return {
          points: item,
          totalPrice: (item * parseFloat(this.dataModal.price)).toFixed(2)
        };
      });
    },
    totalPrice() {
      return (parseFloat(this.dataModal.price) * this.points).toFixed(2);
    }
  },
  methods: {
    yes() {
      const onSuccess = () => {
        if (!this.dataModal.join) {
          this.close();
          return;
        }
        this.$store
          .dispatch("profile/groups/joinGroup", {
            productId: this.dataModal.productId
          })
          .then(() => {
            this.close();
          })
          .catch(() => {
            this.close();
          });
      };
      if (!this.dataModal.renew) {
        this._pay(
          {
            paymentType: "product",
            productId: this.dataModal.productId,
            points: this.points,
            paymentGateCustomerCardToken: this.user.paymentGateCustomerCardToken
          },
          onSuccess
        );
      } else {
        onSuccess();
      }
    },
    no() {
      this.close();
    },
    close() {
      this.progress = false;
      this.$store.commit("modal/hideSafe", { name: "groupPayConfirm" });
    }
  }
};
</script>
