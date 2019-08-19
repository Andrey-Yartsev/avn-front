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
          <h1 class="form-title hidden-mobile" v-if="$mq === 'desktop'">
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

                  <button
                    class="replace-card"
                    id="replaceCard"
                    @click="replaceCard"
                  >
                    <span
                      class="icn-replaced icn-item hidden-desktop"
                      v-if="$mq === 'mobile'"
                    />
                    <span v-if="$mq === 'desktop'">Replace</span>
                  </button>
                  <button
                    class="delete-card icn-item"
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
          <div class="container pos-relative">
            <div
              :fullscreen="false"
              class="loader-container loader-container_center"
              v-if="submitting"
            >
              <Loader text="" :small="true" :semilight="true" />
            </div>
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Street</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field">
                    <input
                      v-model="userinfo.street"
                      name="street"
                      v-validate="'required|latin'"
                      @blur="trimUserInfo('street')"
                    />
                  </span>
                  <div class="error-info" v-if="fieldError('street')">
                    {{ fieldError("street") }}
                  </div>
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
                      v-validate="'required|latin'"
                    />
                  </span>
                  <div class="error-info" v-if="fieldError('city')">
                    {{ fieldError("city") }}
                  </div>
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
                  <div class="error-info" v-if="fieldError('country')">
                    {{ fieldError("country") }}
                  </div>
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
                  <div class="error-info" v-if="fieldError('state')">
                    {{ fieldError("state") }}
                  </div>
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
                      @blur="trimUserInfo('zip')"
                    />
                  </span>
                  <div class="error-info" v-if="fieldError('zip')">
                    {{ fieldError("zip") }}
                  </div>
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
                  <div class="error-info" v-if="fieldError('email')">
                    {{ fieldError("email") }}
                  </div>
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
                      v-validate="'required|numeric|non-amex'"
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
                      <input
                        v-model="expDate"
                        v-mask="'##/##'"
                        v-validate="'required|card-date'"
                        data-vv-validate-on="blur"
                        name="expDate"
                        placeholder="MM/YY"
                        @input="expDateChanged"
                      />
                      <input
                        type="hidden"
                        :value="expMonth"
                        data-securionpay="expMonth"
                      />
                      <input
                        type="hidden"
                        :value="expYear"
                        data-securionpay="expYear"
                      />
                    </div>
                  </div>

                  <span class="card-cvc-num">
                    <span
                      class="form-group form-group_clear-gaps"
                      :class="{ 'field-invalid': fieldError('cvc') }"
                    >
                      <span class="form-field">
                        <input
                          v-model="cvc"
                          name="cvc"
                          type="text"
                          size="8"
                          minlength="3"
                          maxlength="4"
                          data-securionpay="cvc"
                          v-validate="'required|numeric'"
                          data-vv-validate-on="blur"
                          ref="cvc"
                          placeholder="Cvc"
                        />
                      </span>
                    </span>
                  </span>

                  <div class="error-info" v-if="fieldError('expDate')">
                    {{ fieldError("expDate") }}
                  </div>
                  <div class="error-info" v-if="fieldError('cvc')">
                    {{ fieldError("cvc") }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Cardholder Name</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field">
                    <input
                      v-validate="'required|card-holder'"
                      name="cardHolder"
                      v-model="cardHolder"
                      type="text"
                      @blur="trimUserInfo('name')"
                    />
                  </span>
                  <div class="error-info" v-if="fieldError('cardHolder')">
                    {{ fieldError("cardHolder") }}
                  </div>
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
      <Transactions />
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
import { Validator } from "vee-validate";
import creditCardType from "credit-card-type";

Validator.extend("non-amex", {
  getMessage: () => "We are not supporting American Express cards",
  validate: value => {
    return !value.match(/^3[47][0-9]{13}$/);
  }
});

Validator.extend("card-date", {
  getMessage: "Wrong card date expiration",
  validate: value => {
    const r = value.match(/^(\d\d)\/(\d\d)$/);
    if (!r) {
      return false;
    }
    if (r[1] > 12) {
      return false;
    }
    return true;
  }
});

Validator.extend("card-holder", {
  getMessage: "Wrong chars",
  validate: value => {
    return !!value.match(/^[a-z\-'. ]+$/i);
  }
});

Validator.extend("latin", {
  getMessage: "Wrong chars",
  validate: value => {
    return !!value.match(/^[0-9a-z\-'., ]+$/i);
  }
});

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
  },
  expDate: ""
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
    },
    cardHolder: {
      set(value) {
        this.userinfo.name = value.toUpperCase();
      },
      get() {
        return this.userinfo.name;
      }
    }
  },
  methods: {
    next() {
      this.submitting = true;

      if (this.hasCCBill) {
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
          country: this.userinfo.country,
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
          const types = creditCardType(this.cardNumber);
          if (!types.length) {
            this.$store.dispatch("global/flashToast", {
              text: "Wrong credit card number",
              type: "error"
            });
            this.submitting = false;
            return;
          }
          this.$store
            .dispatch("payment/card/add", {
              email: this.email,
              token: result.id,
              ccbillResponse: ccbres,
              userinfo: this.userinfo,
              cardLast4: this.cardNumber.substr(this.cardNumber.length - 4),
              cardBrand: types[0].type
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
    expDateChanged() {
      if (this.expDate.length === 5) {
        const m = this.expDate.match(/^(\d\d)\/(\d\d)$/);
        this.expMonth = m[1];
        this.expYear = "20" + m[2];
        this.$refs.cvc.focus();
      }
    },
    scpayInit() {
      let script = document.createElement("script");
      script.async = true;
      script.src = "https://securionpay.com/js/securionpay.js";
      document.head.appendChild(script);
    },
    trimUserInfo(name) {
      this.userinfo[name] = this.userinfo[name].trim();
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
