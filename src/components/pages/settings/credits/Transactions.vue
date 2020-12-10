<template>
  <div class="PayoutsTransactionsCollectionView settings-wrapper">
    <div
      class="form-title table-header-title table-header-title_sticky border-top bg-gradient bg-gradient_pseudo"
    >
      <div class="bg-gradient__shadow bg-gradient__shadow_mob">
        <div class="inner">
          <span class="semi-transparent">
            Transactions
          </span>
        </div>
        <div class="table-header transactions-table-header">
          <div
            class="date table__cell table__cell_align table__cell_align-hor-c"
          >
            Date
          </div>
          <div
            class="amount table__cell table__cell_selected table__cell_align table__cell_align-hor-c"
          >
            Amount
          </div>
          <div
            class="expected table__cell table__cell_align table__cell_align-hor-c"
          >
            Item
          </div>
        </div>
      </div>
    </div>

    <div
      class="shadow-block no-padding"
      :class="{ 'table-empty': !loading && !transactions.length }"
    >
      <div class="table-wrapper">
        <div class="table transactions-table" v-if="transactions.length">
          <div
            class="PayoutsTransactionsView"
            v-for="v in transactions"
            v-bind:key="v.n"
          >
            <div class="item">
              <div class="date table__cell">{{ dt(v.createdAt) }}</div>
              <div
                :class="amountClass(v.amount)"
                class="amount table__cell table__cell_selected table__cell_align table__cell_align-hor-c"
              >
                {{ dollar(v.amount) }}
              </div>
              <div class="expected table__cell">
                {{ v.description }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="empty-table-info show"
          v-if="!loading && !transactions.length"
        >
          <span>Empty here for now</span>
        </div>
        <div class="loader-infinity" v-if="loading">
          <Loader :fullscreen="false" text="" :inline="true" :small="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import moment from "moment";

export default {
  name: "CreditsSettingsTransactions",

  components: {
    Loader
  },

  computed: {
    loading() {
      return this.$store.state.credits.transactions.fetchLoading;
    },
    transactions() {
      if (!this.$store.state.credits.transactions.fetchResult) {
        return [];
      }
      return this.$store.state.credits.transactions.fetchResult.list;
    },
    transactionsLoading() {
      return this.$store.state.credits.transactions.fetchLoading;
    }
  },

  methods: {
    dt(date) {
      return moment(date).format("DD MMM HH:mm");
    },
    dollar(amount) {
      amount = amount.toString();
      if (amount.match(/-\d+/)) {
        return "-$" + amount.replace(/-(\d+)/, "$1");
      }
      return "$" + amount;
    },
    amountClass(amount) {
      const negative = !!amount.toString().match(/-\d+/);
      if (negative) {
        return {
          negative
        };
      }
      return null;
    }
  },

  created() {
    this.$store.dispatch("credits/transactions/fetch");
  }
};
</script>
