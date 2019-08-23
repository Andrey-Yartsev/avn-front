<template>
  <div class="payments-statements">
    <div class="paymentsStatementsView">
      <div class="payments-wrapper">
        <div
          class="form-title border-top table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
        >
          <div class="bg-gradient__shadow bg-gradient__shadow_mob">
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
        </div>
        <div class="shadow-block no-padding">
          <div class="table-wrapper">
            <div class="table payments-table" v-if="transactions.length">
              <template>
                <div
                  class="PaymentsStatementsCollectionItemView"
                  v-for="(v, i) in transactions"
                  :key="i"
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
                      <span class="success icn-item" v-if="v.isSuccess"></span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div
              class="empty-table-info show"
              v-if="!transactions.length && !transactionsLoading"
            >
              <span>Empty here for now</span>
            </div>
            <div class="loader-infinity" v-if="transactionsLoading">
              <Loader
                :fullscreen="false"
                :inline="true"
                text=""
                :small="true"
              />
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
import InfinityScroll from "@/mixins/infinityScroll";

export default {
  name: "PaymentsSettingsTransactions",
  mixins: [InfinityScroll],
  components: {
    Loader
  },
  computed: {
    store() {
      return this.$store.state.payment.transactions;
    },
    transactions() {
      return this.$store.state.payment.transactions.list;
    },
    transactionsLoading() {
      return this.$store.state.payment.transactions.loading;
    }
  },
  methods: {
    dt(date) {
      return moment(date).format("DD MMM");
    },
    infinityScrollGetDataMethod() {
      this.$store.dispatch("payment/transactions/fetch");
    }
  },
  created() {
    this.$store.dispatch("payment/transactions/firstFetch");
  }
};
</script>
