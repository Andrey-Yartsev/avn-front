<template>
  <div class="payouts-legal">
    <div class="PayoutsLegalView">
      <h1 class="form-title">Personal Information</h1>

      <form class="payouts-legal-form" v-on:submit.stop.prevent="save">
        <div class="border-top shadow-block">
          <div class="container">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">First Name</span>
                <input name="firstName" required v-model="firstName" />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Last Name</span>
                <input name="lastName" required v-model="lastName" />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Date of Birth</span>
                <BirthDateSelect class="birthDateWrapper" v-model="birthDate" />
              </label>
            </div>
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Expiration Date</span>
                <span class="expireationDateWrapper">
                  <span class="card-date-range">
                    <input type="text" />
                    <span class="separator">/</span>
                    <input type="text" />
                  </span>
                  <span class="card-cvc-num">
                    <span class="name-cvc">Cvc</span>
                    <input type="text" />
                  </span>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Legal Type</span>
                <span class="select-wrapper">
                  <select name="type" id="legal-type" required v-model="type">
                    <option value="">Select</option>
                    <option value="company">Company</option>
                    <option value="individual">Individual</option>
                  </select>
                </span>
              </label>
            </div>

            <div
              class="form-group form-group_with-label"
              v-if="type === 'company'"
            >
              <label class="form-group-inner">
                <span class="label">Company Name</span>
                <input name="companyName" v-model="companyName" />
              </label>
            </div>

            <div
              class="form-group form-group_with-label"
              v-if="type === 'company'"
            >
              <label class="form-group-inner">
                <span class="label">EIN</span>
                <input name="companyTaxId" v-model="companyTaxId" />
              </label>
            </div>

            <div class="form-group form-group_with-label photo-form-group">
              <label
                class="form-group-inner photo-form-group-inner"
                :class="{ success: !!preloadedMedias.length }"
              >
                <span class="label">Photo ID</span>

                <div class="photo-label-wrapper">
                  <div class="photo-label">
                    <label for="photo" class="btn lg photo-btn">Upload</label>
                  </div>
                </div>

                <input
                  type="file"
                  id="photo"
                  accept=".jpg,.jpeg,.png"
                  @change="addMediaFiles"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Address</span>
                <input name="address" v-model="address" required />
              </label>
            </div>

            <div class="form-group form-group_with-label city-zip-form-group">
              <label class="form-group-inner">
                <span class="label hidden-mobile">
                  City
                </span>
                <div class="row">
                  <div class="col-form-lg">
                    <label class="hidden-desktop label" for="input-city">
                      City
                    </label>
                    <div class="exp-row">
                      <input
                        name="city"
                        v-model="city"
                        required
                        id="input-city"
                      />
                    </div>
                  </div>
                  <div class="col-form-sm input-cvv-wrapper">
                    <label for="input-cvv" class="input-cvv label">
                      Zip
                    </label>
                    <div class="postalCode-field">
                      <input
                        name="postalCode"
                        v-model="postalCode"
                        required
                        id="input-cvv"
                      />
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner" for="state">
                <span class="label">State</span>
                <span class="select-wrapper">
                  <select id="state" name="state" required v-model="state">
                    <option value="">Select State</option>
                    <option :value="v" v-for="v in states" v-bind:key="v">{{
                      v
                    }}</option>
                  </select>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label country-select">
              <label class="form-group-inner">
                <span class="label country-select__label">Country</span>
                <span class="select-wrapper">
                  <select name="country" disabled v-model="country">
                    <option
                      class="country-select__option"
                      value="United States of America"
                      >United States of America</option
                    >
                  </select>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label help-text">
              <label class="form-group-inner">
                <span class="input-help semi-transparent"
                  >Please
                  <router-link to="/support" target="_blank"
                    >contact our support</router-link
                  >
                  for assistance if you want to change your country</span
                >
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
                      >Terms of Service</router-link
                    >
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div
            class="form-group form-group_with-label hidden"
            id="payouts-legal-form-error"
          >
            <label class="form-group-inner">
              <span class="label"></span>
              <div class="error"></div>
            </label>
          </div>

          <div class="form-group-btn">
            <button type="submit" class="btn lg saveChanges">Next</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BirthDateSelect from "./BirthDateSelect";
import FileUpload from "@/mixins/fileUpload";
import states from "./states";

export default {
  name: "PayoutSettingsLegal",

  mixins: [FileUpload],

  components: {
    BirthDateSelect
  },

  data() {
    return {
      firstName: "",
      lastName: "",
      birthDate: "",
      type: "",
      companyName: "",
      companyTaxId: "",
      address: "",
      postalCode: "",
      city: "",
      state: "",
      country: "United States of America",
      tos: false
    };
  },

  computed: {
    states() {
      return states;
    },
    allMediaTypes() {
      return this.inputAcceptTypes.photo;
    }
  },

  methods: {
    save() {
      if (!this.tos) {
        alert("You need to agree with the terms of service");
        return;
      }
      const fields = [
        "firstName",
        "lastName",
        "birthDate",
        "type",
        "companyName",
        "companyTaxId",
        "address",
        "postalCode",
        "city",
        "state",
        "country"
      ];
      const data = {};
      for (let f of fields) {
        if (this[f]) {
          data[f] = this[f];
        }
      }
      this.$store.dispatch("payouts/legal/save", data).then(r => {
        if (!r.type) {
          return;
        }
        this.$store.dispatch("auth/extendUser", {
          payoutLegalApproveState: "pending"
        });
      });
    }
  }
};
</script>
