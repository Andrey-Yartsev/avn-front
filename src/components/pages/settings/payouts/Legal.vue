<template>
  <div class="payouts-legal" v-if="!loading">
    <div class="PayoutsLegalView">
      <h1 class="form-title settings-title">Personal Information</h1>

      <form class="payouts-legal-form" v-on:submit.stop.prevent="save">
        <div class="border-top shadow-block">
          <div class="container">
            <div
              class="form-group form-group_with-label"
              :class="{ disabled: legalExists }"
            >
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

            <div
              class="form-group form-group_with-label"
              :class="{ disabled: legalExists }"
            >
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

            <div
              class="form-group form-group_with-label"
              :class="{ disabled: legalExists }"
            >
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
                    :max-datetime="maxDate"
                    :flow="['year', 'month', 'date']"
                    :phrases="{ ok: 'ok', cancel: 'Cancel' }"
                  />
                  <span v-if="birthDate" class="field-birthday__text">{{
                    formattedBirthdate
                  }}</span>
                </div>
              </div>
            </div>

            <div
              class="form-group form-group_with-label"
              :class="{ disabled: legalExists }"
            >
              <label class="form-group-inner">
                <span class="label">Legal Type</span>
                <span class="select-wrapper">
                  <select
                    :disabled="legalExists"
                    name="type"
                    id="legal-type"
                    required
                    v-model="type"
                    v-validate="'required'"
                  >
                    <option value="" disabled>Select Type</option>
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
              v-if="type === 'company' && showEINOption"
            >
              <label class="form-group-inner">
                <span class="label">EIN</span>
                <input name="companyTaxId" v-model="companyTaxId" />
              </label>
            </div>

            <template v-if="showABNOptions">
              <div
                class="form-group form-group_with-label form-group_clear-gaps-bottom"
              >
                <label class="form-group-inner">
                  <span class="label">Australian Bus No (ABN)</span>
                  <input name="abn" v-model="abn" v-validate="'required'" />
                </label>
              </div>
              <div class="form-group form-group_with-label">
                <label class="form-group-inner">
                  <span class="input-help">
                    <a href="/static/doc/abn_guide.pdf" target="_blank">
                      ABN guide
                    </a>
                  </span>
                </label>
              </div>
              <div
                class="form-group form-group_with-label radio-group"
                style="marginLeft: 0px"
              >
                <div class="form-group-inner">
                  <span class="label">I am registered for GST</span>
                  <label class="radio-wrapper icn-item m-inline">
                    <input
                      type="radio"
                      name="gstRegistered"
                      value="yes"
                      v-model="gstRegistered"
                      v-validate="'required'"
                    />
                    <span class="label">
                      Yes
                    </span>
                  </label>
                  <label class="radio-wrapper icn-item m-inline">
                    <input
                      type="radio"
                      name="gstRegistered"
                      value="no"
                      v-model="gstRegistered"
                      v-validate="'required'"
                    />
                    <span class="label">
                      No
                    </span>
                  </label>
                </div>
              </div>
            </template>

            <div class="form-group form-group_with-label photo-form-group">
              <div
                class="form-group-inner photo-form-group-inner"
                :class="{ 'success icn-item': !!uploadedPhoto }"
              >
                <span class="label">Photo ID</span>

                <div class="photo-label-wrapper">
                  <label
                    for="photo"
                    class="btn btn_fix-width btn_block border photo-btn"
                    >Upload</label
                  >
                </div>

                <input
                  type="file"
                  id="photo"
                  accept=".jpg,.jpeg,.png"
                  ref="photo"
                  @change="upload"
                />
              </div>
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

            <div
              class="form-group form-group_with-label disabled country-select"
            >
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
                    <option value="" disabled>Select State</option>
                    <option :value="v.title" v-for="v in states" :key="v.id">{{
                      v.title
                    }}</option>
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
          </div>

          <div class="form-group-btn">
            <button
              type="submit"
              class="btn lg btn_fix-width saveChanges"
              :disabled="!canSave || saving || imageUploading"
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
import { Settings, DateTime as LuxonDateTime } from "luxon";
import moment from "moment";
import "vue-datetime/dist/vue-datetime.css";
import States from "./states";
import UserMixin from "@/mixins/user";

Settings.defaultLocale = "en";

export default {
  name: "PayoutSettingsLegal",
  mixins: [Form, States, UserMixin],
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
      tos: false,
      uploadedPhoto: null,
      legalExisted: false,
      imageUploading: false,
      abn: "",
      gstRegistered: null
    };
  },
  computed: {
    loading() {
      return (
        this.$store.state.payouts.countries.fetchLoading ||
        this.$store.state.states.fetchLoading
      );
    },
    country() {
      return this.account.countryId;
    },
    allMediaTypes() {
      return this.inputAcceptTypes.photo;
    },
    canSave() {
      if (!this.isFormValid) {
        return false;
      }
      if (!this.uploadedPhoto && !this.legalExists) {
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
    maxDate() {
      return LuxonDateTime.local()
        .minus({ year: 18 })
        .toISO();
    },
    legal() {
      return this.$store.state.payouts.legal.fetchResult;
    },
    legalExists() {
      return this.legal && this.legal.type;
    },
    showABNOptions() {
      return (
        this.account.countryName && this.account.countryName === "Australia"
      );
    },
    showEINOption() {
      return (
        this.account.countryName &&
        this.account.countryName === "United States of America"
      );
    }
  },
  methods: {
    async upload() {
      this.imageUploading = true;
      try {
        this.uploadedPhoto = await upload(this.$refs.photo.files[0]);
        this.imageUploading = false;
      } catch (error) {
        this.imageUploading = false;
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
      if (this.showABNOptions) {
        fields.push("abn", "gstRegistered");
      }
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

        if (
          !this.legalExisted ||
          this.user.payoutLegalApproveState === "rejected"
        ) {
          this.$store.dispatch("auth/extendUser", {
            payoutLegalApproveState: "pending"
          });
        }
      });
    }
  },
  mounted() {
    this.$emit("titleChanged", "Personal Information");
    if (this.legalExists) {
      this.legalExisted = true;
      Object.keys(this.legal).forEach(k => {
        this[k] = this.legal[k];
      });
    }
  }
};
</script>
