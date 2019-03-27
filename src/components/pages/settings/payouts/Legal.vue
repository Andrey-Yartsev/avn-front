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
                <BirthDateSelect v-if="false" class="birthDateWrapper" v-model="birthDate" />
                <Datetime
                  :inputId="`post-datetime__switcher_birthdate`"
                  class="post-datetime__switcher"
                  type="datetime"
                  v-model="birthDate"
                  input-class="post-datetime__input"
                  use12-hour
                  :flow="['year', 'month', 'date']"
                  :phrases="{ ok: 'ok', cancel: 'Cancel' }"
                />
                <span v-if="birthDate">{{ formattedBirthdate }}</span>
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
                    <label for="photo" class="btn lg photo-btn">Upload</label>
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

            <div class="form-group form-group_with-label">
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
                  <select
                    name="country"
                    disabled
                    v-model="country"
                    v-validate="'required'"
                  >
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
              :disabled="!canSave"
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
import states from "./states";
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
      country: "United States of America",
      tos: false,
      uploadedPhoto: null
    };
  },

  computed: {
    states() {
      return states;
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
    }
  },

  methods: {
    async upload() {
      this.uploadedPhoto = await upload(this.$refs.photo.files[0]);
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
          data[f] = this[f];
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
    this.$emit("titleChanged", "Personal Information");
  }
};
</script>
