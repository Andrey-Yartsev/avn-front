<template>
  <Modal :onClose="close">
    <div class="popup-container subscribe-popup" slot="content">
      <div class="content">
        <div class="subscribePopupView">
          <div class="subscribe-popup__header bg">
            <img v-if="profile.header" :src="profile.header">
          </div>

          <div class="subscribe-popup__info">
            <div class="subscribe-popup__info-avatar">
              <span class="avatar"><span class="avatar__img"><img  v-if="profile.avatar" :src="profile.avatar"></span></span>
            </div>

            <div class="subscribe-popup__info-user">
              <div class="subscribe-popup__info-name">
                <router-link :to="'/' + profile.username" class="name">{{ profile.name }}</router-link>
                <span v-if="profile.isVerified" class="verified-user"></span>
              </div>
              <div class="user-login">
                <router-link :to="'/' + profile.username">{{ profile.username }}</router-link>
              </div>
            </div>
          </div>

          <div class="subscribe-popup__body">
            <p class="subscribe-popup__body-title">
              Subscription Benefits
            </p>
            <ul class="subscribe-popup__list">
              <li class="subscribe-popup__list-item">
                <span></span>
              </li>
              <li class="subscribe-popup__list-item">
                <span></span>
              </li>
              <li class="subscribe-popup__list-item">
                <span></span>
              </li>
              <li class="subscribe-popup__list-item">
                <span></span>
              </li>
              <li class="subscribe-popup__list-item">
                <span></span>
              </li>
            </ul>
          </div>

          <div class="subscribe-popup__footer">
            <button
              @click="subscribe"
              type="submit"
              class="btn lg primary-color"
              id="subscribe-proceed">
              Subscribe for
              ${{ profile.subscribePrice }} / month
            </button>
            <p class="subscribe-popup__footer-text">You will be charged
              <a>${{ profile.subscribePrice }} monthly</a>
              until you cancel your subscription
            </p>
          </div>
        </div>
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "SubscribeModal",

  components: {
    Modal
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
      this.close();
      this.$store.dispatch("subscription/openPaymentModal", this.profile);
    }
  }
};
</script>
