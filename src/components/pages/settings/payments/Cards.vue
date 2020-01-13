<template>
  <div
    class="shadow-block border-top cards"
    :class="{ 'shadow-block_reset-pt': cards.length }"
  >
    <div class="container">
      <div class="loader-infinity" v-if="loading">
        <Loader
          text=""
          :small="true"
          :semilight="true"
          :inline="true"
          :fullscreen="false"
        />
      </div>

      <div class="cards-list" v-else-if="cards.length">
        <div
          v-for="card in cards"
          :key="card.id"
          :class="[
            'cards-list__item',
            card.paymentGateCardBrand
              ? card.paymentGateCardBrand.toLowerCase()
              : ''
          ]"
        >
          <template v-if="card.blocked">
            <span class="blocked-card icn-block icn-item"></span>
          </template>
          <template v-else>
            <span v-if="card.isDefault" class="status-card on icn-item"></span>
            <span
              v-else
              class="status-card icn-item"
              v-tooltip="'Set as default'"
              @click="setDefault(card.id)"
            ></span>
          </template>

          <span class="payment-system">
            {{ card.cardBrand }}
          </span>
          <span class="card-number">
            {{ card.cardLast4 }}
          </span>

          <span v-if="card.blocked" class="card-blocked">
            Card is blocked
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
  }
};
</script>
