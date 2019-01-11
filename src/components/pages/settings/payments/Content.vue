<template>
  <div class="rounded-container rounded-container_fluid-height">
    <div class="payments">
      <div class="payments-card" v-if="cardConnected">
        <div class="payment-card">
          <div>
            <div class="form-title hidden-desktop">
              <div class="inner">
                <span class="semi-transparent">
                  Your Card
                </span>
              </div>
            </div>
            <h1 class="form-title hidden-mobile">
              Your Card
            </h1>

            <div class="border-top loader-container" v-if="cardLoading">
              <Loader :fullscreen="false" text="" class="transparent small" />
            </div>

            <div class="shadow-block border-top no-padding" v-else-if="card">
              <div class="container">
                <div class="cards-list">
                  <div class="item visa" :class="getCardType(card)">
                    <span class="payment-system">
                      {{ ucFirst(getCardType(card)) }}
                    </span>
                    <span class="number">{{ card }}</span>
                    <button v-if="cardDeleting" class="delete">In progress</button>
                    <button v-else class="delete" id="deleteCard" @click="deleteCard">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
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
                <div class="amount table__cell table__cell_selected  table__cell_align table__cell_align-hor-c">Amount
                </div>
                <div class="user table__cell">User</div>
                <div class="status table__cell table__cell_align table__cell_align-hor-c">Status</div>
              </div>
            </div>

            <div class="border-top shadow-block loader-container" v-if="transactionsLoading">
              <Loader :fullscreen="false" text="" class="transparent small" />
            </div>

            <div class="shadow-block no-padding" v-else>
              <div class="table-wrapper">
                <div class="table payments-table">
                  <template v-if="transactions.length">
                    <div
                      class="PaymentsStatementsCollectionItemView"
                      v-for="v in transactions"
                      v-bind:key="v.createdAt"
                    >
                    <div class="item">
                      <div
                        class="date table__cell table__cell_align table__cell_align-vert-c"
                      >{{ dt(v.createdAt) }}</div>
                      <div
                        class="amount table__cell table__cell_selected table__cell_align table__cell_align-hor-c table__cell_align-vert-c">
                        ${{ v.amount }}
                      </div>
                      <div class="user table__cell">
                        <router-link :to="'/' + v.userTo.username" target="_blank"
                           class="userview-block payment-user-wrapper">
                          <span class="avatar avatar_sm">
                            <span class="avatar__img">
                              <img :src="v.userTo.avatar" v-if="v.userTo.avatar" />
                            </span>
                          </span>
                          <span class="name">{{ v.userTo.name }}</span>
                          <span class="user-login">{{ v.userTo.username }}</span>
                        </router-link>
                      </div>
                      <div class="status table__cell table__cell_align table__cell_align-vert-c">
                        <span class="success" v-if="v.isSuccess"></span>
                      </div>
                    </div>
                  </div>

                  </template>
                </div>
                <div class="empty-table-info"><span>Empty here for now</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="payments-nocard"></div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import dateFns from "date-fns";

export default {
  name: "PaymentsSettingsContent",

  components: {
    Loader
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    cardConnected() {
      return this.user.isPaymentCardConnected;
    },
    cardLoading() {
      return this.$store.state.payment.card.fetchLoading;
    },
    cardDeleting() {
      return this.$store.state.payment.card.deleteRequestLoading;
    },
    card() {
      return this.$store.state.payment.card.card;
    },
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
    ucFirst(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    deleteCard() {
      this.$store.dispatch("payment/card/delete");
    },
    dt(date) {
      return dateFns.format(new Date(date), "DD MMM");
    },
    /**
     * https://stackoverflow.com/a/21617574
     * @param cur_val
     * @return {string}
     */
    getCardType: function(cur_val) {
      // the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
      // regexp string length {0} provided for soonest detection of beginning of the card numbers this way it could be used for BIN CODE detection also

      //JCB
      const jcb_regex = new RegExp("^(?:2131|1800|35)[0-9]{0,}$"); //2131, 1800, 35 (3528-3589)
      // American Express
      const amex_regex = new RegExp("^3[47][0-9]{0,}$"); //34, 37
      // Diners Club
      const diners_regex = new RegExp("^3(?:0[0-59]{1}|[689])[0-9]{0,}$"); //300-305, 309, 36, 38-39
      // Visa
      const visa_regex = new RegExp("^4[0-9]{0,}$"); //4
      // MasterCard
      const mastercard_regex = new RegExp(
        "^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$"
      ); //2221-2720, 51-55
      const maestro_regex = new RegExp("^(5[06789]|6)[0-9]{0,}$"); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
      //Discover
      const discover_regex = new RegExp(
        "^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$"
      );
      ////6011, 622126-622925, 644-649, 65

      // get rid of anything but numbers
      cur_val = cur_val.replace(/\D/g, "");

      // checks per each, as their could be multiple hits
      //fix: ordering matter in detection, otherwise can give false results in rare cases
      let sel_brand = "unknown";
      if (cur_val.match(jcb_regex)) {
        sel_brand = "JCB";
      } else if (cur_val.match(amex_regex)) {
        sel_brand = "Amex";
      } else if (cur_val.match(diners_regex)) {
        sel_brand = "Diners Club";
      } else if (cur_val.match(visa_regex)) {
        sel_brand = "Visa";
      } else if (cur_val.match(mastercard_regex)) {
        sel_brand = "Mastercard";
      } else if (cur_val.match(discover_regex)) {
        sel_brand = "Discover";
      } else if (cur_val.match(maestro_regex)) {
        if (cur_val[0] == "5") {
          //started 5 must be mastercard
          sel_brand = "Mastercard";
        } else {
          sel_brand = "Maestro"; //maestro is all 60-69 which is not something else, thats why this condition in the end
        }
      }

      return sel_brand;
    }
  },

  created() {
    if (this.cardConnected) {
      this.$store.dispatch("payment/card/fetch");
    }
    this.$store.dispatch("payment/transactions/fetch");
  }
};
</script>
