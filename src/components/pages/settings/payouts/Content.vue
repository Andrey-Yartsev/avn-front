<template>
  <div class="rounded-container pos-relative" id="payouts-container">
    <div class="payouts">
      <div
        class="border-top shadow-block loader-container loader-container_center"
        v-if="loading"
      >
        <Loader :fullscreen="false" :inline="true" text="" :small="true" />
      </div>
      <template v-else>
        <div class="PayoutsAccountView" v-if="!user.isWantEarn">
          <h1 class="form-title settings-title">
            Payouts
          </h1>
          <div class="form-title form-title__default-text border-top centered">
            You need to enable <b>Earn money</b> option in
            <router-link to="/settings/profile">Profile</router-link>
            settings
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
import Bank from "./Bank.vue";
import BankMixin from "./bank.js";
import Summery from "./Summery";
import Unexpected from "./Unexpected";
import IdDocsForm from "./IdDocsForm";
import BankProofForm from "./BankProofForm";

/*
1. Account
2. Legal
3. Legal Pending
3.5 W9
4. Bank
5. Summery
*/

export default {
  name: "PayoutsSettingsContent",

  mixins: [User, BankMixin],

  components: {
    Loader
  },

  data() {
    return {
      loading: true
    };
  },

  computed: {
    isShowW9Form() {
      return (
        this.user?.payoutLegalApproveState === "approved" &&
        this.legal?.isNeedW9
      );
    },
    isShowIdDocsForm() {
      return (
        (this.user?.payoutLegalApproveState === "approved" ||
          this.user?.payoutLegalApproveState === "pending") &&
        this.legal?.isNeedIdDocs
      );
    },
    isShowBankProofForm() {
      return (
        (this.user?.payoutLegalApproveState === "approved" ||
          this.user?.payoutLegalApproveState === "pending") &&
        this.legal?.isNeedBankProof
      );
    },
    innerComponent() {
      if (!this.accountExists) {
        if (this.user.canEarn) {
          return Summery;
        } else {
          return Account;
        }
      } else {
        if (!this.legalExists || this.legalExistsWithoutState) {
          return Legal;
        }
        if (this.user.payoutLegalApproveState === "rejected") {
          return Legal;
        }
        if (this.user.payoutLegalApproveState === "pending") {
          if (this.isShowIdDocsForm) {
            return IdDocsForm;
          } else if (this.isShowBankProofForm) {
            return BankProofForm;
          } else {
            return LegalPending;
          }
        }
        if (this.user.payoutLegalApproveState === "approved") {
          if (this.isShowIdDocsForm) {
            return IdDocsForm;
          } else if (this.isShowBankProofForm) {
            return BankProofForm;
          } else if (this.bankExists) {
            return Summery;
          } else {
            // console.log("BANK NOT EXISTS", this.bankExists);
            return Bank;
          }
        }
        return Unexpected;
      }
    },
    account() {
      return this.$store.state.payouts.account.fetchResult;
    },
    countries() {
      return this.$store.state.payouts.countries.fetchResult;
    },
    hasStates() {
      if (!this.countries) {
        return false;
      }
      return this.countries.find(v => this.account.countryId === v.id)
        .hasStates;
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
    legalExistsWithoutState() {
      if (!this.legalExists) {
        return false;
      }
      if (!this.hasStates) {
        return false;
      }
      return !this.legal.state;
    },
    isApproved() {
      return this.user.payoutLegalApproveState === "approved";
    },
    bankExists() {
      return this.bank.isApprove;
    }
  },

  methods: {
    changeTitle(title) {
      this.$emit("titleChanged", title);
    }
  },

  watch: {
    isShowW9Form: {
      immediate: true,
      handler(value) {
        if (value) {
          this.$router.replace("/settings/w9");
        }
      }
    }
  },

  created() {
    this.$store.dispatch("payouts/reset");
    this.$store
      .dispatch("payouts/account/fetch")
      .then(() => {
        this.$store.dispatch("payouts/legal/fetch").then(() => {
          this.$store.dispatch("payouts/bank/fetch").then(() => {
            this.$store.dispatch("payouts/countries/fetch").then(() => {
              this.loading = false;
            });
          });
        });
      })
      .catch(() => {
        this.loading = false;
      });
  }
};
</script>
