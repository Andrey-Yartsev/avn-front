<template>
  <Modal :onClose="close">
    <div class="popup-container subscribe-popup" slot="content">
      <div class="content">
        <Content
          :profile="profile"
          @subscribe="resubscribe"
          :progress="progress"
          :isResubscribe="true"
        >
          <template slot="button-text">
            {{ daysLeft }} days left - Resubscribe ${{ profile.subscribePrice }}
          </template>
          <template slot="footer-text">
            You will not be charged until next billing period
          </template>
        </Content>
      </div>
      <button
        type="button"
        class="close close_light close_visible-mob icn-item icn-size_lg"
        @click="close"
      />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Content from "./SubscribeModalContent";
import moment from "moment";

export default {
  name: "SubscribeModal",

  data() {
    return {
      progress: false
    };
  },

  components: {
    Modal,
    Content
  },

  computed: {
    profile() {
      return this.$store.state.modal.resubscribe.data;
    },
    daysLeft() {
      const today = moment(Date.now());
      const lastDay = moment(this.profile.subscribedByExpireDate);
      return lastDay.diff(today, "days");
    }
  },

  methods: {
    close() {
      this.$store.commit("modal/hide", { name: "resubscribe" });
    },
    resubscribe() {
      this.progress = true;
      this.$store
        .dispatch("subscription/resubscribe", {
          userId: this.profile.id
        })
        .then(result => {
          this.$store.commit("modal/hideSafe", { name: "resubscribe" });
          this.$store.commit("subscription/statusUpdate", {
            action: "resubscribe",
            result,
            data: {
              userId: this.profile.id
            }
          });
        });
    }
  }
};
</script>
