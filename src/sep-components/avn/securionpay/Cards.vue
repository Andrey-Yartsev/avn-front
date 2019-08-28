<template>
  <div class="shadow-block border-top no-padding cards">
    <div class="container">
      <div
        :fullscreen="false"
        class="loader-container loader-container_center"
        v-if="loading"
      >
        <Loader text="" :small="true" :semilight="true" />
      </div>

      <div class="cards-list" v-else>
        <div
          v-for="card in cards"
          :key="card.id"
          :class="[
            'item',
            card.paymentGateCardBrand
              ? card.paymentGateCardBrand.toLowerCase()
              : ''
          ]"
        >
          <span v-if="card.isDefault" class="status-card on icn-item"></span>
          <span
            v-else
            class="status-card icn-item"
            v-tooltip="'Set as default'"
            @click="setDefault(card.id)"
          ></span>

          <span class="payment-system">
            {{ card.cardBrand }}
          </span>
          <span class="card-number">
            {{ card.cardLast4 }}
          </span>

          <button
            class="delete-card icn-item"
            id="deleteCard"
            @click="remove(card.id)"
          >
            <span
              class="icn-remove icn-item hidden-desktop"
              v-if="$mq === 'mobile'"
            ></span>
            <span v-if="$mq === 'desktop'">Delete</span>
          </button>
        </div>
      </div>

      <div class="cards__btn">
        <button
          type="button"
          class="btn alt border btn_fix-width-sm"
          @click="showForm(true)"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";

export default {
  name: "SettingsPaymentCards",
  components: { Loader },
  computed: {
    cards() {
      return this.$store.state.payment.card.cards;
    },
    loading() {
      return this.$store.state.payment.card.cardsLoading;
    }
  },
  methods: {
    remove(id) {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Remove your card",
          success: () => {
            this.$store.dispatch("payment/card/remove", id);
          }
        }
      });
    },
    setDefault(id) {
      this.$store.dispatch("payment/card/setDefault", id);
    },
    showForm(show) {
      this.$emit("showForm", show);
    }
  },
  mounted() {
    this.scpayInit();
  }
};
</script>
