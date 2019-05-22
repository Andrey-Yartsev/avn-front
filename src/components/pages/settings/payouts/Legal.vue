<template>
  <div class="payouts-legal" v-if="!loading">
    <div class="PayoutsLegalView">
      <h1 class="form-title">Personal Information</h1>

      <form class="payouts-legal-form" v-on:submit.stop.prevent="save">
        <div class="border-top shadow-block">
          <div class="container">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">First Name</span>
                <input
                  name="firstName"
                  required
                  v-model="firstName"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Last Name</span>
                <input
                  name="lastName"
                  required
                  v-model="lastName"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <div class="form-group-inner">
                <span class="label">Date of Birth</span>
                <div class="field-birthday">
                  <Datetime
                    :inputId="`post-datetime__switcher_birthdate`"
                    class="field-birthday__input"
                    type="datetime"
                    v-model="birthDate"
                    input-class=""
                    v-validate="'required'"
                    use12-hour
                    :flow="['year', 'month', 'date']"
                    :phrases="{ ok: 'ok', cancel: 'Cancel' }"
                  />
                  <span v-if="birthDate" class="field-birthday__text">{{
                    formattedBirthdate
                  }}</span>
                </div>
              </div>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Legal Type</span>
                <span class="select-wrapper">
                  <select
                    name="type"
                    id="legal-type"
                    required
                    v-model="type"
                    v-validate="'required'"
                  >
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
                <input
                  name="companyName"
                  v-model="companyName"
                  v-validate="'required'"
                />
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
                :class="{ success: !!uploadedPhoto }"
              >
                <span class="label">Photo ID</span>

                <div class="photo-label-wrapper">
                  <div class="photo-label">
                    <label for="photo" class="btn border photo-btn"
                      >Upload</label
                    >
                  </div>
                </div>

                <input
                  type="file"
                  id="photo"
                  accept=".jpg,.jpeg,.png"
                  ref="photo"
                  @change="upload"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Address</span>
                <input
                  name="address"
                  v-model="address"
                  required
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label city-zip-form-group">
              <div class="form-group-inner">
                <span class="label hidden-mobile" v-if="$mq === 'desktop'">
                  City
                </span>
                <div class="row">
                  <div class="col-form-lg">
                    <label
                      class="hidden-desktop label"
                      for="input-city"
                      v-if="$mq === 'mobile'"
                    >
                      City
                    </label>
                    <div class="exp-row">
                      <input
                        name="city"
                        v-model="city"
                        required
                        id="input-city"
                        v-validate="'required'"
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
                        v-validate="'required'"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group form-group_with-label disabled country-select">
              <label class="form-group-inner">
                <span class="label country-select__label">Country</span>
                <span class="select-wrapper">
                  <select name="country" disabled v-validate="'required'">
                    <option class="country-select__option">{{
                      account.countryName
                    }}</option>
                  </select>
                </span>
              </label>
            </div>

            <div class="form-group form-group_with-label" v-if="hasStates">
              <label class="form-group-inner" for="state">
                <span class="label">State</span>
                <span class="select-wrapper">
                  <select
                    id="state"
                    name="state"
                    required
                    v-model="state"
                    v-validate="'required'"
                  >
                    <option value="">Select State</option>
                    <option
                      :value="v.title"
                      v-for="v in states"
                      v-bind:key="v.id"
                      >{{ v.title }}</option
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
                  <input
                    type="checkbox"
                    name="tos"
                    value="1"
                    v-model="tos"
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
          </div>

          <div class="form-group-btn">
            <button
              type="submit"
              class="btn lg btn_fix-width saveChanges"
              :disabled="!canSave || saving"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BirthDateSelect from "./BirthDateSelect";
import Form from "@/mixins/form";
import upload from "@/utils/upload";
import { Datetime } from "vue-datetime";
import { Settings } from "luxon";
import moment from "moment";
import "vue-datetime/dist/vue-datetime.css";

Settings.defaultLocale = "en";

export default {
  name: "PayoutSettingsLegal",

  mixins: [Form],

  components: {
    BirthDateSelect,
    Datetime
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
      tos: false,
      uploadedPhoto: null
    };
  },

  computed: {
    loading() {
      return (
        this.$store.state.payouts.countries.fetchLoading ||
        this.$store.state.states.fetchLoading
      );
    },
    account() {
      return this.$store.state.payouts.account.fetchResult;
    },
    country() {
      return this.account.countryId;
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
    allMediaTypes() {
      return this.inputAcceptTypes.photo;
    },
    canSave() {
      if (!this.isFormValid) {
        return false;
      }
      if (!this.uploadedPhoto) {
        return false;
      }
      return true;
    },
    formattedBirthdate() {
      return moment(this.birthDate).format("LL");
    },
    saving() {
      return this.$store.state.payouts.legal.saveLoading;
    },
    _states() {
      return this.$store.state.states.fetchResult;
    },
    states() {
      if (!this._states) {
        return [];
      }
      return Object.entries(this._states).map(v => {
        return {
          id: v[0],
          title: v[1],
          selected: v[0].id === this.state
        };
      });
    }
  },

  methods: {
    async upload() {
      try {
        this.uploadedPhoto = await upload(this.$refs.photo.files[0]);
      } catch (error) {
        this.$store.dispatch("global/setError", error);
      }
    },
    save() {
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
          data[f] =
            f === "birthDate" ? moment(this[f]).format("YYYY-MM-DD") : this[f];
        }
      }
      data.personalIdImage = this.uploadedPhoto;
      this.$store.dispatch("payouts/legal/save", data).then(r => {
        if (!r.type) {
          return;
        }
        this.$store.dispatch("auth/extendUser", {
          payoutLegalApproveState: "pending"
        });
      });
    }
  },

  mounted() {
    this.$store.dispatch("payouts/countries/fetch").then(() => {
      if (this.hasStates) {
        this.$store.dispatch("states/fetch", this.account.countryId);
      }
    });
    this.$emit("titleChanged", "Personal Information");
  }
};
</script>
