<template>
  <div class="payouts-bank">
    <div class="PayoutsBankView">
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
                  <label class="checkbox-label">
                    <input type="checkbox" name="tos" value="1" v-model="tos" />
                    <span></span>
                  </label>
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
              <button type="submit" class="btn lg saveChanges">Next</button>
            </div>

            <div>{{ error }}</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Form from "@/mixins/form";

export default {
  name: "AddCard",
  mixins: [Form],
  data() {
    return {
      error: null,
      cardNumber: "4242424242424242",
      cvc: "111",
      expMonth: "01",
      expYear: "2029",
      email: "asd@asd.as",
      userinfo: {
        street: "Noroad st.",
        city: "NN",
        state: "Russia",
        zip: "123123",
        country: "Russia",
        name: "Tester Tester"
      }
    };
  },
  methods: {
    next() {
      console.log(process.env.VUE_APP_SECURION_PK);
      window.Securionpay.setPublicKey(process.env.VUE_APP_SECURION_PK);
      window.Securionpay.createCardToken(
        this.$refs.form,
        this.createCardTokenCallback
      );
    },
    createCardTokenCallback(result) {
      if (result.error) {
        this.error = result.error.message;
      } else {
        this.$store
          .dispatch("payment/card/add", {
            email: this.email,
            token: result.id,
            userinfo: {
              street: "825 Dawson Dr, Qwintry Suite 12",
              city: "Newark",
              state: "DE",
              zip: "19712-082",
              country: "US",
              name: "PAVEL MAVEL"
            }
          })
          .then(r => {
            console.log(">>", r);
          });
      }
    }
  },
  mounted() {}
};
</script>
