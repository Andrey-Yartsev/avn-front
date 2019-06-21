<template>
  <div class="payouts-bank">
    <div class="payments-card" v-if="showCard">
      <div class="payment-card">
        <div>
          <div class="form-title hidden-desktop" v-if="$mq === 'mobile'">
            <div class="inner">
              <span class="semi-transparent">
                Your Card
              </span>
            </div>
          </div>
          <h1 class="form-title hidden-mobile">
            Your Card
            <button
              @click="$router.push('/settings/credits')"
              class="balance-info"
            >
              Balance: {{ user.creditBalance }} credits
            </button>
          </h1>
          <div class="shadow-block border-top no-padding">
            <div class="container">
              <div class="cards-list">
                <div
                  :class="[
                    'item',
                    user.paymentGateCardBrand
                      ? user.paymentGateCardBrand.toLowerCase()
                      : ''
                  ]"
                >
                  <span class="payment-system">
                    {{ user.paymentGateCardBrand }}
                  </span>
                  <span class="card-number">
                    {{ user.paymentGateCardLast4 }}
                  </span>

                  <button class="replace" id="replaceCard" @click="replaceCard">
                    <span
                      class="icn-replaced icn-item hidden-desktop"
                      v-if="$mq === 'mobile'"
                    />
                    <span v-if="$mq === 'desktop'">Replace</span>
                  </button>
                  <button
                    class="delete icn-item"
                    id="deleteCard"
                    @click="deleteCard"
                  >
                    <span
                      class="icn-remove icn-item hidden-desktop"
                      v-if="$mq === 'mobile'"
                    ></span>
                    <span v-if="$mq === 'desktop'">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transactions />
    </div>
    <div class="PayoutsBankView" v-else>
      <h1 class="form-title">
        Add Card
      </h1>
      <form
        class="payouts-bank-form"
        v-on:submit.stop.prevent="next"
        ref="form"
      >
        <div class="border-top shadow-block">
          <div class="container">
            <div
              :fullscreen="false"
              class="shadow-block loader-container no-padding"
              v-if="submitting"
            >
              <Loader text="" class="small no-text" />
            </div>
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Street</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field">
                    <input
                      v-model="userinfo.street"
                      name="street"
                      v-validate="'required'"
                    />
                  </span>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">City</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field">
                    <input
                      v-model="userinfo.city"
                      name="city"
                      v-validate="'required'"
                    />
                  </span>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Country</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="select-wrapper form-field">
                    <select
                      name="country"
                      id="account-country"
                      v-validate="'required'"
                      v-model="userinfo.country"
                    >
                      <option
                        v-for="v in countries"
                        v-bind:key="v.id"
                        :value="v.code"
                        >{{ v.name }}
                      </option>
                    </select>
                  </span>
                </span>
              </label>
            </div>

            <div
              class="form-group form-group_with-label"
              :class="{ 'field-loading': statesLoading }"
              v-if="hasStates"
            >
              <label class="form-group-inner">
                <span class="label">State/Country</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="select-wrapper form-field">
                    <select
                      id="state"
                      name="state"
                      v-model="userinfo.state"
                      v-validate="'required'"
                    >
                      <option :value="null">
                        {{ statesLoading ? "Loading..." : "Select State" }}
                      </option>
                      <option :value="v.name" v-for="v in states" :key="v.id">{{
                        v.name
                      }}</option>
                    </select>
                  </span>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">ZIP/Post Code</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field">
                    <input
                      v-model="userinfo.zip"
                      name="zip"
                      v-validate="'required'"
                    />
                  </span>
                </span>
              </label>
            </div>
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Email</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field">
                    <input
                      v-model="email"
                      name="email"
                      v-validate="'required|email'"
                    />
                  </span>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Card Number</span>
                <span
                  class="form-group form-group_clear-gaps"
                  :class="{ 'field-invalid': fieldError('cardNumber') }"
                >
                  <span class="form-field">
                    <input
                      name="cardNumber"
                      v-model.lazy="cardNumber"
                      size="20"
                      data-securionpay="number"
                      autocomplete="cc-number"
                      minlength="13"
                      maxlength="19"
                      v-validate="'required|numeric'"
                    />
                  </span>
                  <div class="error-info" v-if="fieldError('cardNumber')">
                    {{ fieldError("cardNumber") }}
                  </div>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <div class="form-group-inner">
                <span class="label">Expiration Date</span>

                <div class="cards-details">
                  <div
                    class="group-expiration-date"
                    :class="{ 'field-invalid': fieldError('expDate') }"
                  >
                    <div class="form-field">
                      <CardExpDate
                        v-validate="'card-exp-date'"
                        name="expDate"
                        @input="expDateChanged"
                      />
                    </div>
                    <div class="error-info" v-if="fieldError('expDate')">
                      {{ fieldError("expDate") }}
                    </div>
                  </div>

                  <span class="card-cvc-num">
                    <span class="name-cvc">Cvc</span>
                    <span class="form-group form-group_clear-gaps">
                      <span class="form-field">
                        <input
                          v-model="cvc"
                          type="text"
                          size="8"
                          minlength="3"
                          maxlength="4"
                          data-securionpay="cvc"
                          v-validate="'required|numeric'"
                        />
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Cardholder Name</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field">
                    <input v-model="userinfo.name" type="text" />
                  </span>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label"></span>
                <div class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="tos"
                    value="1"
                    v-validate="'required'"
                  />
                  <div class="label input-desc payouts-desc icn-item">
                    I agree to
                    <router-link
                      to="/terms"
                      class="payouts-terms"
                      target="_blank"
                      >Terms of Service
                    </router-link>
                  </div>
                </div>
              </label>
            </div>

            <div class="form-group-btn">
              <button
                type="submit"
                class="btn lg btn_fix-width"
                :disabled="submitDisabled"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Form from "@/mixins/form";
import User from "@/mixins/user";
import CardExpDate from "@/components/common/CardExpDate";
import Transactions from "@/components/pages/settings/payments/Transactions";
import { goCcbill } from "@/utils/ccbill";
import States from "@/components/pages/settings/payments/states";
import Loader from "@/components/common/Loader";

const initData = {
  showCardForm: false,
  cardError: null,
  cardNumber: "",
  cvc: "",
  expMonth: "",
  expYear: "",
  email: "",
  submitting: false,
  tokens: {
    ccb: {
      status: null,
      data: {}
    },
    scp: {
      status: null,
      data: {}
    }
  }
};

const userinfo = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  name: ""
};

export default {
  name: "AddCardSecurionpay",
  mixins: [Form, User, States],
  components: {
    CardExpDate,
    Loader,
    Transactions
  },
  data() {
    const r = { ...initData };
    r.userinfo = { ...userinfo };
    return r;
  },
  computed: {
    hasCCBill() {
      return !!this.$store.state.init.data.payments.ccbill;
    },
    cardConnected() {
      return this.user.isPaymentCardConnected;
    },
    showCard() {
      return this.cardConnected && !this.showCardForm;
    },
    submitDisabled() {
      return this.submitting || !this.isFormValid;
    },
    IP() {
      return this.$store.state.init.data.ip;
    }
  },
  methods: {
    next() {
      this.submitting = true;

      if (this.hasCCBill && this.userinfo.country === "US") {
        this.tokens.ccb.status = "pending";
        const customerInfo = {
          email: this.email,
          city: this.userinfo.city,
          state: this.userinfo.state,
          zipcode: this.userinfo.zip,
          customerFname: this.userinfo.name.split(" ")[0],
          customerLname: this.userinfo.name.split(" ")[1],
          address1: this.userinfo.street,
          address2: "",
          phoneNumber: "",
          country: "US",
          ipAddress: this.IP
        };

        const creditCardPaymentInfo = {
          cardNum: this.cardNumber,
          expMonth: this.expMonth,
          expYear: this.expYear,
          nameOnCard: this.userinfo.name
        };

        goCcbill(customerInfo, creditCardPaymentInfo, this.submitCCB);
      } else {
        this.tokens.ccb.status = "reject";
      }

      this.tokens.scp.status = "pending";

      window.Securionpay.setPublicKey(process.env.VUE_APP_SECURION_PK);
      window.Securionpay.createCardToken(this.$refs.form, this.submitSCPay);
    },
    submitSCPay(result) {
      this.tokens.scp.status = "ready";
      this.tokens.scp.data = result;
      this.createCardTokenCallback();
    },
    submitCCB(result) {
      this.tokens.ccb.status = result.status;
      this.tokens.ccb.data = result.data;
      this.createCardTokenCallback();
    },
    createCardTokenCallback() {
      if (
        (this.tokens.ccb.status === "ready" ||
          this.tokens.ccb.status === "reject") &&
        this.tokens.scp.status === "ready"
      ) {
        const result = this.tokens.scp.data;
        const ccbres = this.tokens.ccb.data;

        if (result.error) {
          this.$store.dispatch("global/flashToast", {
            text: result.error.message,
            type: "error"
          });
          this.submitting = false;
        } else {
          this.$store
            .dispatch("payment/card/add", {
              email: this.email,
              token: result.id,
              ccbillResponse: ccbres,
              userinfo: this.userinfo
            })
            .then(r => {
              if (r.success) {
                this.$store.dispatch("profile/fetch");
                this.showCardForm = false;
                if (this.$store.state.payment.card.afterAddCardRedirect) {
                  this.$store.dispatch("global/flashToast", {
                    text: "Card added successfully"
                  });
                  this.$router.push(
                    this.$store.state.payment.card.afterAddCardRedirect
                  );
                  this.$store.commit("payment/card/resetAfterAddCardRedirect");
                }
              } else {
                this.$store.dispatch("global/flashToast", {
                  text: "Something goes wrong",
                  type: "error"
                });
              }
              this.submitting = false;
            })
            .catch(() => {
              this.submitting = false;
            });
        }
      }
    },
    reset() {
      Object.entries(initData).forEach(v => {
        this[v[0]] = v[1];
      });
      this.userinfo = { ...userinfo };
    },
    replaceCard() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Replace your card",
          success: () => {
            this.reset();
            this.showCardForm = true;
            this.fetchCountries();
          }
        }
      });
    },
    deleteCard() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Remove your card",
          success: () => {
            this.$store.dispatch("payment/card/delete").then(() => {
              this.reset();
              this.showCardForm = true;
              this.fetchCountries();
            });
          }
        }
      });
    },
    expDateChanged(value) {
      if (value.expMonth) {
        this.expMonth = value.expMonth;
      }
      if (value.expYear) {
        this.expYear = value.expYear;
      }
    },
    scpayInit() {
      let script = document.createElement("script");
      script.async = true;
      script.src = "https://securionpay.com/js/securionpay.js";
      document.head.appendChild(script);
    }
  },
  watch: {
    showCard: {
      immediate: true,
      handler(showCard) {
        if (!showCard) {
          this.$emit("titleChanged", "Add Card");
        } else {
          this.$emit("titleChanged", "Your Card");
        }
      }
    }
  },
  mounted() {
    this.scpayInit();
  }
};
</script>
