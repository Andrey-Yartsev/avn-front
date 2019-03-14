<template>
  <div class="payments-statements">
    <div class="paymentsStatementsView">
      <div class="payments-wrapper">
        <div class="form-title border-top table-header-title">
          <div class="inner">
            <span class="semi-transparent">
              Payments Statements
            </span>
          </div>
          <div class="table-header payments-table-header">
            <div class="date table__cell">Date</div>
            <div
              class="amount table__cell table__cell_selected  table__cell_align table__cell_align-hor-c"
            >
              Amount
            </div>
            <div class="user table__cell">User</div>
            <div
              class="status table__cell table__cell_align table__cell_align-hor-c"
            >
              Status
            </div>
          </div>
        </div>

        <div
          class="border-top shadow-block loader-container"
          v-if="transactionsLoading"
        >
          <Loader :fullscreen="false" text="" class="transparent small" />
        </div>

        <div class="shadow-block no-padding" v-else>
          <div class="table-wrapper">
            <div class="table payments-table">
              <template v-if="transactions.length">
                <div
                  class="PaymentsStatementsCollectionItemView"
                  v-for="v in transactions"
                  v-bind:key="v.createdAt + v.userTo.username"
                >
                  <div class="item">
                    <div
                      class="date table__cell table__cell_align table__cell_align-vert-c"
                    >
                      {{ dt(v.createdAt) }}
                    </div>
                    <div
                      class="amount table__cell table__cell_selected table__cell_align table__cell_align-hor-c table__cell_align-vert-c"
                    >
                      ${{ v.amount }}
                    </div>
                    <div class="user table__cell">
                      <router-link
                        :to="'/' + v.userTo.username"
                        target="_blank"
                        class="userview-block payment-user-wrapper"
                      >
                        <span class="avatar avatar_sm">
                          <span class="avatar__img">
                            <img
                              :src="v.userTo.avatar"
                              v-if="v.userTo.avatar"
                            />
                          </span>
                        </span>
                        <span class="name">{{ v.userTo.name }}</span>
                        <span class="user-login reset-ml">{{
                          v.userTo.username
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="status table__cell table__cell_align table__cell_align-vert-c"
                    >
                      <span class="success" v-if="v.isSuccess"></span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div class="empty-table-info">
              <span>Empty here for now</span>
            </div>
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
  name: "PaymentsSettingsTransactions",

  components: {
    Loader
  },

  computed: {
    transactions() {
      if (!this.$store.state.payment.transactions.fetchResult) {
        return [];
      }
      return this.$store.state.payment.transactions.fetchResult.list;
    },
    transactionsLoading() {
      return this.$store.state.payment.transactions.fetchLoading;
    }
  },

  methods: {
    dt(date) {
      return moment(date).format("DD MMM");
    }
  },

  created() {
    this.$store.dispatch("payment/transactions/fetch");
  }
};
</script>
