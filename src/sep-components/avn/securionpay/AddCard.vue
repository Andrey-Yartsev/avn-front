<template>
  <div class="payouts-bank">
    <div class="payments-card" v-if="showCard">
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
                  <span class="number">{{ user.paymentGateCardLast4 }}</span>

                  <button class="delete" id="deleteCard" @click="replaceCard">
                    Replace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
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
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Street</span>
                <input
                  v-model="userinfo.street"
                  name="street"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">City</span>
                <input
                  v-model="userinfo.city"
                  name="city"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">State/Country</span>
                <input
                  v-model="userinfo.state"
                  name="state"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">ZIP/Post Code</span>
                <input
                  v-model="userinfo.zip"
                  name="zip"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Country</span>
                <input
                  v-model="userinfo.country"
                  name="country"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Email</span>
                <input
                  v-model="email"
                  name="email"
                  v-validate="'required|email'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Card Number</span>
                <input
                  v-model="cardNumber"
                  size="20"
                  data-securionpay="number"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Expiration Date</span>
                <span class="expireationDateWrapper">
                  <span class="card-date-range">
                    <input
                      v-model="expMonth"
                      type="text"
                      size="2"
                      data-securionpay="expMonth"
                    />
                    <span class="separator">/</span>
                    <input
                      v-model="expYear"
                      type="text"
                      size="4"
                      minlength="4"
                      maxlength="4"
                      data-securionpay="expYear"
                    />
                  </span>
                  <span class="card-cvc-num">
                    <span class="name-cvc">Cvc</span>
                    <input
                      v-model="cvc"
                      type="text"
                      size="8"
                      data-securionpay="cvc"
                    />
                  </span>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Cardholder Name</span>
                <input v-model="userinfo.name" type="text" />
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
                  <span class="checkbox"></span>
                  <div class="input-desc payouts-desc">
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

            <div class="form-group hidden" id="payouts-bank-form-error">
              <label class="form-group-inner">
                <span class="label"></span>
                <div class="error"></div>
              </label>
            </div>

            <div class="form-group-btn">
              <button
                type="submit"
                class="btn lg saveChanges"
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

const initData = {
  showCardForm: false,
  cardError: null,
  cardNumber: "",
  cvc: "",
  expMonth: "",
  expYear: "",
  email: "",
  submitting: false
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
  mixins: [Form, User],
  data() {
    const r = { ...initData };
    r.userinfo = { ...userinfo };
    return r;
  },
  computed: {
    cardConnected() {
      return this.user.isPaymentCardConnected;
    },
    showCard() {
      return this.cardConnected && !this.showCardForm;
    },
    submitDisabled() {
      return this.submitting || !this.isFormValid;
    }
  },
  methods: {
    next() {
      this.submitting = true;
      window.Securionpay.setPublicKey(process.env.VUE_APP_SECURION_PK);
      window.Securionpay.createCardToken(
        this.$refs.form,
        this.createCardTokenCallback
      );
    },
    createCardTokenCallback(result) {
      if (result.error) {
        this.$store.dispatch("global/flashToast", result.error.message);
        this.submitting = false;
      } else {
        this.$store
          .dispatch("payment/card/add", {
            email: this.email,
            token: result.id,
            userinfo: this.userinfo
          })
          .then(r => {
            if (r.success) {
              this.$store.dispatch("auth/extendUser", {
                isPaymentCardConnected: true
              });
              this.showCardForm = false;
            } else {
              this.$store.dispatch("global/flashToast", "Something goes wrong");
            }
            this.submitting = false;
          });
      }
    },
    reset() {
      Object.entries(initData).forEach(v => {
        this[v[0]] = v[1];
      });
      this.userinfo = { ...userinfo };
    },
    replaceCard() {
      this.reset();
      this.showCardForm = true;
    }
  },
  mounted() {
    let script = document.createElement("script");
    script.onload = () => {
      //
    };
    script.async = true;
    script.src = "https://securionpay.com/js/securionpay.js";
    document.head.appendChild(script);
  }
};
</script>
