<template>
  <div class="payouts-transactions">
    <div class="PayoutsTransactionsCollectionView">
      <div class="form-title table-header-title border-top">
        <div class="inner">
          <span class="semi-transparent">
            Transactions
          </span>
        </div>

        <div class="border-top loader-container" v-if="loading">
          <Loader :fullscreen="false" text="" class="transparent small" />
        </div>

        <div class="table-header transactions-table-header" v-if="!loading">
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
      <div class="shadow-block no-padding" v-if="!loading">
        <div class="table-wrapper">
          <div class="table transactions-table">
            <div
              class="PayoutsTransactionsView"
              v-for="v in items"
              v-bind:key="v.n"
            >
              <div class="item">
                <div class="date table__cell">{{ dt(v.createdAt) }}</div>
                <div
                  class="amount table__cell table__cell_selected table__cell_align table__cell_align-hor-c"
                >
                  ${{ v.amount }}
                </div>
                <div class="expected table__cell">
                  <div class="type payout-type">Monthly subscription from</div>
                  <div class="payout-user">
                    <router-link :to="'/' + v.userFrom.username" class="name">
                      {{ v.userFrom.name }}
                    </router-link>
                    <span class="user-login">
                      <router-link :to="'/' + v.userFrom.username">{{
                        v.userFrom.username
                      }}</router-link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="empty-table-info"><span>Empty here for now</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import dateFns from "date-fns";

export default {
  name: "PayoutSettingsSummeryTransactions",

  components: {
    Loader
  },

  computed: {
    loading() {
      return this.$store.state.payouts.transactions.fetchLoading;
    },
    items() {
      if (!this.$store.state.payouts.transactions.fetchResult) {
        return [];
      }
      let n = 1;
      return this.$store.state.payouts.transactions.fetchResult.list.map(v => {
        n++;
        v.id = n;
        return v;
      });
    }
  },

  methods: {
    dt(date) {
      return dateFns.format(new Date(date), "DD MMM, hh:mm");
    }
  },

  created() {
    this.$store.dispatch("payouts/transactions/fetch");
  }
};
</script>
