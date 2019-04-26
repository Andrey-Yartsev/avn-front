<template>
  <div
    class="rounded-container rounded-container_fluid-height"
    id="payouts-container"
  >
    <div class="payouts">
      <div
        class="border-top shadow-block loader-container loader-container_payouts"
        v-if="loading"
      >
        <Loader :fullscreen="false" text="" class="transparent small no-text" />
      </div>
      <template v-else>
        <div class="PayoutsAccountView" v-if="!user.isWantEarn">
          <h1 class="form-title">
            Payouts
          </h1>
          <div class="form-title text border-top centered">
            <div class="inner">
              You need to enable <b>Earn money</b> option in
              <router-link to="/settings/profile">Profile</router-link>
              settings
            </div>
          </div>
        </div>

        <component :is="innerComponent" v-else @titleChanged="changeTitle" />
      </template>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import Loader from "@/components/common/Loader";
import Account from "./Account";
import Legal from "./Legal";
import LegalPending from "./LegalPending";
import Bank from "./Bank";
import Summery from "./Summery";
import Unexpected from "./Unexpected";

/*
1. Account
2. Legal
3. Legal Pending
4. Bank
5. Summery
*/

export default {
  name: "PayoutsSettingsContent",

  mixins: [User],

  components: {
    Loader
  },

  data() {
    return {
      loading: true
    };
  },

  computed: {
    innerComponent() {
      if (!this.accountExists) {
        return Account;
      } else {
        if (!this.legalExists) {
          return Legal;
        }
        if (this.user.payoutLegalApproveState === "rejected") {
          return Legal;
        }
        if (this.user.payoutLegalApproveState === "pending") {
          return LegalPending;
        }
        if (this.user.payoutLegalApproveState === "approved") {
          if (this.bankExists) {
            return Summery;
          } else {
            return Bank;
          }
        }
        return Unexpected;
      }
    },
    account() {
      return this.$store.state.payouts.account.fetchResult;
    },
    accountExists() {
      return this.account && this.account.countryId;
    },
    legal() {
      return this.$store.state.payouts.legal.fetchResult;
    },
    legalExists() {
      return this.legal && this.legal.type;
    },
    isApproved() {
      return this.user.payoutLegalApproveState === "approved";
    },
    bank() {
      return this.$store.state.payouts.bank.fetchResult;
    },
    bankExists() {
      return this.bank && this.bank.accountNumber;
    }
  },

  methods: {
    changeTitle(title) {
      this.$emit("titleChanged", title);
    }
  },

  created() {
    this.$store.dispatch("payouts/account/fetch").then(r => {
      if (r.countryId) {
        this.$store.dispatch("payouts/legal/fetch").then(() => {
          if (this.isApproved) {
            this.$store.dispatch("payouts/bank/fetch").then(() => {
              this.loading = false;
            });
          } else {
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
      }
    });
  }
};
</script>
