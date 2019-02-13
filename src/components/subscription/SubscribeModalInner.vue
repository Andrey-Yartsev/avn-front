<template>
  <Modal :onClose="close">
    <div class="popup-container subscribe-popup" slot="content">
      <div class="content">
        <Loader
          v-if="loading"
          :fullscreen="false"
          text=""
          class="transparent small"
        />
        <Content
          v-else
          :profile="profile"
          @subscribe="subscribe"
          :progress="progress"
        >
          <template slot="button-text">
            Subscribe for ${{ profile.subscribePrice }} / month
          </template>
          <template slot="footer-text">
            You will be charged
            <a>${{ profile.subscribePrice }} monthly</a>
            until you cancel your subscription
          </template>
        </Content>
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Content from "./SubscribeModalContent";
import User from "@/mixins/user";
import Loader from "@/components/common/Loader";

export default {
  name: "SubscribeModal",
  mixins: [User],
  components: {
    Modal,
    Content,
    Loader
  },
  props: {
    loading: {
      type: Boolean,
      require: true,
      default: false
    },
    progress: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  computed: {
    profile() {
      return this.$store.state.modal.subscribe.data;
    }
  },
  methods: {
    close() {
      this.$store.commit("modal/hideSafe", { name: "subscribe" });
    },
    subscribe() {
      this.$emit("subscribe");
    }
  }
};
</script>
