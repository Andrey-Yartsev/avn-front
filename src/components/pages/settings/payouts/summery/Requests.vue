<template>
  <div class="payouts-requests">
    <div class="PayoutsRequestsCollectionView">
      <div class="form-title table-header-title border-top">
        <div class="inner">
          <span class="semi-transparent">
            Payouts Statements
          </span>
        </div>

        <div class="border-top loader-container" v-if="loading">
          <Loader :fullscreen="false" text="" class="transparent small" />
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
      <div class="shadow-block no-padding" v-if="!loading && !items.length">
        <div class="table-wrapper">
          <div class="table payouts-table">
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
  name: "PayoutSettingsSummeryRequests",

  components: {
    Loader
  },

  computed: {
    loading() {
      return this.$store.state.payouts.requests.fetchLoading;
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
    }
  },

  methods: {
    dt(date) {
      return dateFns.format(new Date(date), "DD MMM, hh:mm");
    }
  },

  created() {
    this.$store.dispatch("payouts/requests/fetch");
  }
};
</script>
