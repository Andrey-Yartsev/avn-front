<template>
  <div class="payouts-requests">
    <div class="PayoutsRequestsCollectionView">
      <div
        class="form-title border-top table-header-title_sticky bg-gradient bg-gradient_pseudo"
        :class="{ 'table-header-title': !loading }"
      >
        <div class="bg-gradient__shadow bg-gradient__shadow_mob">
          <div class="inner">
            <span class="semi-transparent">
              Payouts Statements
            </span>
            <button @click="withdrawRequest" :disabled="withdrawRequesting">
              Withdraw Request
            </button>
          </div>
          <div class="table-header payouts-table-header" v-if="!loading">
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
              Expected
            </div>
          </div>
        </div>
      </div>
      <div
        class="border-top shadow-block no-padding loader-container"
        v-if="loading"
      >
        <Loader :fullscreen="false" text="" class="transparent small no-text" />
      </div>
      <div class="shadow-block no-padding">
        <div class="table-wrapper">
          <div class="table payouts-table" v-if="!loading && items.length">
            <div
              class="PayoutsRequestsView"
              v-for="v in items"
              v-bind:key="v.n"
            >
              <div class="item">
                <div class="date table__cell">{{ dt(v.createdAt) }}</div>
                <div
                  class="amount table__cell table__cell_selected table__cell_align table__cell_align-hor-c"
                >
                  {{ v.amount }}
                </div>
                <div class="expected table__cell">{{ v.state }}</div>
              </div>
            </div>
          </div>
          <div class="empty-table-info show" v-if="!items.length">
            <span>Empty here for now</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import moment from "moment";

export default {
  name: "PayoutSettingsSummeryRequests",

  components: {
    Loader
  },

  computed: {
    loading() {
      return this.$store.state.payouts.requests.fetchLoading;
      // return true;
    },
    items() {
      if (!this.$store.state.payouts.requests.fetchResult) {
        return [];
      }
      let n = 1;
      return this.$store.state.payouts.requests.fetchResult.list.map(v => {
        n++;
        v.id = n;
        return v;
      });
    },
    withdrawRequesting() {
      return this.$store.state.payouts.requests.withdrawLoading;
    }
  },

  methods: {
    dt(date) {
      return moment(date).format("DD MMM, hh:mm");
    },
    async withdrawRequest() {
      await this.$store.dispatch("payouts/requests/withdraw");
      this.$store.dispatch("payouts/requests/fetch");
    }
  },

  created() {
    this.$store.dispatch("payouts/requests/fetch");
  }
};
</script>
