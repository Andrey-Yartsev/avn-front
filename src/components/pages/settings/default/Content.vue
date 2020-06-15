<template>
  <div class="profile-wrapper">
    <h1 class="form-title settings-title" v-if="$mq === 'desktop'">
      Edit Profile
    </h1>
    <form class="settings-form" v-on:submit.stop.prevent="save">
      <div
        :class="{
          'border-top': $mq === 'desktop',
          'shadow-block': $mq === 'mobile'
        }"
      >
        <div class="container">
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Name</span>
              <span class="form-group form-group_clear-gaps">
                <span class="form-field">
                  <input name="name" v-model="localUser.name" maxlength="70" />
                </span>
              </span>
            </label>
          </div>
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Username</span>
              <span class="form-group form-group_clear-gaps">
                <span class="form-field">
                  <input
                    ref="username"
                    type="text"
                    name="username"
                    id="profileUsername"
                    v-model="localUser.username"
                    required
                    autocomplete="off"
                    minlength="5"
                    maxlength="20"
                    pattern="[a-zA-Z0-9-_]{5,20}"
                    title="Only letters, digits and '_', '-' allowed. From 5 to 20 characters."
                  />
                </span>
              </span>
            </label>
          </div>
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Website</span>
              <span class="form-group form-group_clear-gaps">
                <span class="form-field">
                  <input
                    type="text"
                    name="website"
                    v-model="localUser.website"
                    pattern="(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)"
                  />
                </span>
              </span>
            </label>
          </div>
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">About</span>
              <span class="form-group form-group_clear-gaps">
                <span class="form-field">
                  <TextareaAutosize
                    rows="3"
                    name="about"
                    :minHeight="50"
                    :maxHeight="200"
                    v-model="localUser.about"
                    maxlength="500"
                  ></TextareaAutosize>
                </span>
              </span>
            </label>
          </div>
          <div class="form-group form-group_with-label color-schemes-wrapper">
            <div class="form-group-inner">
              <span class="label">Theme color</span>
              <div class="row">
                <div class="col-1-2">
                  <ColorSelect
                    name="primaryColor"
                    label="Primary"
                    text="Select your primary color"
                    wrapperClass="primary"
                    v-model="localUser.primaryColor"
                    @input="colorsChanged"
                  />
                </div>
                <div class="col-1-2">
                  <ColorSelect
                    name="secondColor"
                    label="Secondary"
                    text="Select your secondary color"
                    wrapperClass="secondary"
                    v-model="localUser.secondColor"
                    @input="colorsChanged"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="form-group form-group_with-label gender-options">
            <label class="form-group-inner">
              <span class="label">Time Zone</span>
              <div class="form-group form-group_clear-gaps">
                <div class="select-wrapper">
                  <select name="userTZ" v-model="localUser.userTZ">
                    <option value="">Not specified</option>
                    <option :value="v" v-for="v in tz" :key="v">
                      {{ v }}
                    </option>
                  </select>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <template v-if="!user.deleteRequested">
        <div class="toggle-wrapper border-top option-earn-money">
          <label
            class="toggle-label semi-transparent"
            for="is_paid_subscription"
          >
            I want to earn money using AVN Stars
          </label>
          <label class="toggle-element">
            <input
              type="checkbox"
              id="is_paid_subscription"
              name="isWantEarn"
              @change="save"
              v-model="localUser.isWantEarn"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
        <div
          class="shadow-block"
          id="is_paid_subscription__wrapper"
          v-if="localUser.isWantEarn"
        >
          <div class="container">
            <div class="form-group form-group_with-label">
              <label
                class="form-group-inner subscription"
                :class="{
                  disabled: !user.canEarn
                }"
              >
                <span class="label">Subscription</span>
                <span class="subscription__field field-symbol-currency">
                  <span
                    class="form-field"
                    :class="{
                      'field-invalid': fieldError('subscribePrice')
                    }"
                  >
                    <span class="subscription__per-month">per month</span>
                    <input
                      class="field-gap_currency field-gap_timeunit"
                      type="number"
                      min="0"
                      :max="setMaxPrice"
                      step="0.01"
                      name="subscribePrice"
                      v-model="localUser.subscribePrice"
                      :disabled="!user.canEarn"
                      v-validate="'subscription-price'"
                    />
                  </span>
                  <div class="error-info" v-if="fieldError('subscribePrice')">
                    {{ fieldError("subscribePrice") }}
                  </div>
                </span>
              </label>

              <div class="form-group-inner subscription" v-if="!user.canEarn">
                <span class="label" v-if="$mq === 'desktop'"></span>
                <span class="subscription-desc">
                  Before setting your monthly subscription price (or to be able
                  to accept tips), you must first
                  <router-link to="/settings/payouts"
                    >add a bank account</router-link
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
        <Discount v-if="isFullyMonetizedUser" />
        <UserDiscounts v-if="isFullyMonetizedUser" />
      </template>

      <DeleteRestore v-else />

      <div class="form-title" :class="{ 'border-top': $mq === 'desktop' }">
        <div class="inner form-group form-group_clear-gaps option-star">
          <label class="toggle-label semi-transparent" for="im_star">
            I am an AVN Star
            <p class="subtext">
              Enable this option if any of the following describes you:<br />Performer
              / Model / Content Creator
            </p>
          </label>
          <label class="toggle-element">
            <input
              type="checkbox"
              id="im_star"
              name="isWantEarn"
              @change="save"
              v-model="localUser.nominatable"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>
      <div class="shadow-block">
        <div class="container">
          <div
            class="form-group form-group_with-label"
            :class="{ disabled: !localUser.nominatable }"
          >
            <label class="form-group-inner">
              <span class="label">My Primary Content Audience</span>
              <div class="row">
                <div class="col-1-2">
                  <div class="select-wrapper">
                    <select
                      name="gender"
                      class="default-disabled"
                      v-model="localUser.category"
                    >
                      <option
                        v-for="gender in genderPreferenceList"
                        :value="gender.id"
                        :key="gender.id"
                      >
                        {{ gender.title }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="form-title border-top">
        <div class="inner">
          <span class="semi-transparent">
            Private Information
            <p class="subtext">
              This information will not be publicly displayed
            </p>
          </span>
        </div>
      </div>

      <div class="shadow-block">
        <div class="container">
          <div class="form-group form-group_with-label gender-options">
            <label class="form-group-inner">
              <span class="label">Gender</span>
              <div class="row">
                <div class="col-1-2">
                  <div class="select-wrapper">
                    <select
                      name="gender"
                      class="default-disabled"
                      :value="localUser.gender"
                      @change="genderChanged"
                    >
                      <option value="0">Not specified</option>
                      <option
                        v-for="gender in genderList"
                        :value="gender.id"
                        :key="gender.id"
                      >
                        {{ gender.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div class="form-group form-group_with-label gender-options">
            <label class="form-group-inner">
              <span class="label">My Default Viewing Preference</span>
              <div class="row">
                <div class="col-1-2">
                  <div class="select-wrapper">
                    <select
                      name="categoryView"
                      class="default-disabled"
                      :value="user.categoryView"
                      @change="categoryViewChanged"
                    >
                      <option
                        v-for="gender in genderViewPreferenceList"
                        :value="gender.id"
                        :key="gender.id"
                      >
                        {{ gender.title }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div class="form-group-btn hidden-mobile">
            <button
              type="submit"
              class="btn lg btn_fix-width"
              :disabled="loading || !changed || !isFormValid"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ColorSelect from "./ColorSelect";
import Common from "../common";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import Form from "@/mixins/form";
import DeleteRestore from "../DeleteRestore";
import timezones from "@/utils/timezones";
import Discount from "./Discount";
import UserDiscounts from "./UserDiscounts";
import User from "@/mixins/user";

export default {
  name: "ProfileSettingsContent",

  mixins: [Common, Form, User],

  components: {
    ColorSelect,
    TextareaAutosize,
    DeleteRestore,
    Discount,
    UserDiscounts
  },

  methods: {
    colorsChanged() {
      this.$store.dispatch("auth/extendUser", {
        primaryColor: this.localUser.primaryColor,
        secondColor: this.localUser.secondColor
      });
      this.$store.dispatch("profile/update", this.localUser);
    },
    categoryViewChanged(e) {
      this.$store.dispatch("gender/switchCategory", e.target.value);
    },
    genderChanged(e) {
      const gender = parseInt(e.target.value);
      // 2 - female
      if (gender === 2 && this.localUser.category === 3) {
        this.localUser.category = 2;
      }
      this.localUser.gender = gender;
    }
  },

  computed: {
    about() {
      if (!this.localUser) {
        return null;
      }
      return this.localUser.about;
    },
    genderList() {
      return this.$store.state.init.data.genders;
    },
    genderPreferenceList() {
      const list = this.$store.state.init.data.categoryUser.map(v => {
        v.title = v.name[0].toUpperCase() + v.name.slice(1);
        return v;
      });
      if (this.localUser.gender === 2) {
        return list.filter(v => v.id !== 3);
      }
      return list;
    },
    genderViewPreferenceList() {
      return this.$store.state.init.data.categoryView.map(v => {
        v.title = v.name[0].toUpperCase() + v.name.slice(1);
        return v;
      });
    },
    subscribePrice() {
      if (!this.localUser) {
        return null;
      }
      return this.localUser.subscribePrice;
    },
    tz() {
      return timezones;
    },
    setMaxPrice() {
      return this.user.subscribePrice > 50 ? null : 50;
    }
  },

  watch: {
    about() {
      if (!this.localUser.about) {
        return "";
      }
      this.localUser.about = this.localUser.about.replace(
        new RegExp("<br />", "g"),
        ""
      );
    }
    // subscribePrice(subscribePrice) {
    //   this.localUser.subscribePrice = subscribePrice.toString().replace(",", ".");
    //   console.log(this.localUser.subscribePrice);
    // }
  },

  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const signup = urlParams.get("signup");
    if (signup) {
      setTimeout(() => {
        this.$refs.username.focus();
      }, 500);
    }

    if (this.localUser.about) {
      this.localUser.about = this.localUser.about.replace(
        new RegExp("<br />", "g"),
        ""
      );
    }
  }
};
</script>
