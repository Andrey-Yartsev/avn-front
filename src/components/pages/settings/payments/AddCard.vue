<template>
  <div class="payouts-bank">
    <div class="payments-card" v-if="showCardsList">
      <div class="payment-card">
        <div>
          <div class="form-title hidden-desktop" v-if="$mq === 'mobile'">
            <div class="inner">
              <span class="semi-transparent">
                Your Cards
              </span>
            </div>
          </div>
          <h1
            class="form-title hidden-mobile settings-title"
            v-if="$mq === 'desktop'"
          >
            Your Cards
            <button
              @click="$router.push('/settings/credits')"
              class="balance-info"
            >
              Balance: {{ user.creditBalance }} credits
            </button>
          </h1>
          <Cards @showForm="onShowCardsForm" @replaceCard="replaceCard" />
        </div>
      </div>
    </div>
    <div class="PayoutsBankView" v-else>
      <h1 class="form-title settings-title">
        {{ title }}
      </h1>
      <CardForm @cancel="onShowCardsForm(false)" :cardId="cardId" />
    </div>
    <Transactions />
  </div>
</template>

<script>
import User from "@/mixins/user";
import Transactions from "@/components/pages/settings/payments/Transactions";
import CardForm from "./CardForm";
import Cards from "./Cards";

export default {
  name: "AddCardSecurionpay",
  mixins: [User],
  components: {
    Transactions,
    CardForm,
    Cards
  },
  data() {
    return {
      showCardForm: false,
      cardId: 0
    };
  },
  computed: {
    showCardsList() {
      return /* this.cardConnected && */ !this.showCardForm;
    },
    cards() {
      return this.$store.state.payment.card.cards;
    },
    cardsLoading() {
      return this.$store.state.payment.card.cardsLoading;
    },
    card() {
      if (!this.cardId) {
        return null;
      }
      if (this.cardsLoading) {
        return null;
      }
      return this.cards.find(v => v.id === this.cardId);
    },
    title() {
      if (this.cardId) {
        let s = "Replace card";
        if (this.card) {
          s += " - " + this.card.cardBrand + " ..." + this.card.cardLast4;
        }
        return s;
      }
      return "Add Card";
    }
  },
  methods: {
    onShowCardsForm(show) {
      this.showCardForm = show;
      if (!show) {
        this.cardId = 0;
      }
    },
    replaceCard(id) {
      this.cardId = id;
      this.showCardForm = true;
    },
    scpayInit() {
      let script = document.createElement("script");
      script.async = true;
      script.src = "https://securionpay.com/js/securionpay.js";
      document.head.appendChild(script);
    }
  },
  watch: {
    showCard: {
      immediate: true,
      handler(showCard) {
        if (!showCard) {
          this.$emit("titleChanged", "Add Card");
        } else {
          this.$emit("titleChanged", "Your Card");
        }
      }
    }
  },
  mounted() {
    this.scpayInit();
    this.$store.dispatch("payment/card/fetch");
  }
};
</script>
