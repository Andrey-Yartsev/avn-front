<template>
  <div class="payouts-transactions" v-if="items.length">
    <div class="PayoutsTransactionsCollectionView">
      <div
        class="form-title table-header-title table-header-title_sticky border-top bg-gradient bg-gradient_pseudo"
      >
        <div class="bg-gradient__shadow bg-gradient__shadow_mob">
          <div class="inner">
            <span class="semi-transparent">
              Transactions
            </span>
          </div>
          <div
            class="table-header transactions-table-header"
            v-if="items.length"
          >
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
      <div class="shadow-block no-padding">
        <div class="table-wrapper">
          <div class="table transactions-table" v-if="items.length">
            <div
              v-for="(v, i) in items"
              :key="i"
              class="PayoutsTransactionsView"
              :class="{ excluded: v.isExcluded }"
            >
              <div class="item">
                <div class="date table__cell">
                  {{ dt(v.createdAt) }}
                  <!-- <div class="user-login" v-if="v.isPending">pending</div> -->
                  <div class="user-login" v-if="v.isExcluded">refunded</div>
                </div>
                <div
                  class="amount table__cell table__cell_selected table__cell_align table__cell_align-hor-c"
                >
                  ${{ v.amount }}
                </div>
                <div class="expected table__cell">
                  <div class="type payout-type">{{ v.description }}</div>
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
          <div class="empty-table-info show" v-if="!loading && !items.length">
            <span>Empty here for now</span>
          </div>
          <div class="loader-infinity" v-if="loading">
            <Loader :fullscreen="false" text="" :inline="true" :small="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import { format } from "date-fns";
import InfinityScroll from "@/mixins/infinityScroll";

export default {
  name: "PayoutSettingsSummeryTransactions",
  mixins: [InfinityScroll],
  components: {
    Loader
  },
  computed: {
    store() {
      return this.$store.state.payouts.transactions;
    },
    loading() {
      return this.$store.state.payouts.transactions.loading;
    },
    items() {
      return this.$store.state.payouts.transactions.list;
    }
  },
  methods: {
    dt(date) {
      return format(new Date(date), "MMM dd, HH:mm");
    },
    infinityScrollGetDataMethod() {
      this.$store.dispatch("payouts/transactions/fetch");
    }
  },
  created() {
    this.$store.dispatch("payouts/transactions/firstFetch");
  }
};
</script>
