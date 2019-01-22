<template>
  <div class="profile-wrapper">
    <h1 class="form-title">Edit Profile</h1>
    <form class="settings-form" v-on:submit.stop.prevent="save">
      <div class="border-top shadow-block">
        <div class="container">
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Name</span>
              <input name="name" v-model="localUser.name">
            </label>
          </div>
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Username</span>
              <input
                ref="username"
                type="text" name="username" id="profileUsername"
                v-model="localUser.username" required
                autocomplete="off" minlength="5" maxlength="20"
                pattern="[a-zA-Z0-9-_]{5,20}"
                title="Only letters, digits and '_', '-' allowed. From 5 to 20 characters.">
            </label>

          </div>
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Website</span>
              <input
                type="text"
                name="website"
                v-model="localUser.website"
                pattern="(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)">
            </label>
          </div>
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">About</span>
              <TextareaAutosize
                rows="3"
                name="about"
                :minHeight="30"
                :maxHeight="200"
                v-model="localUser.about"
                maxlength="500"
              ></TextareaAutosize>
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
        </div>
      </div>
      <div class="toggle-wrapper border-top option-earn-money">
        <label class="toggle-label semi-transparent" for="is_paid_subscription">I want to earn money using
          OnMyTeam</label>
        <label class="toggle-element">
          <input
            type="checkbox" id="is_paid_subscription" name="isWantEarn"
            v-model="localUser.isWantEarn"
          >
          <span></span>
        </label>
      </div>
      <div class="shadow-block" id="is_paid_subscription__wrapper" v-if="localUser.isWantEarn">
        <div class="container">
          <div class="form-group form-group_with-label">
            <label class="form-group-inner subscription">
              <span class="label">Subscription</span>
              <span class="subscription__field">
                <span class="subscription__per-month">per month</span>
                <input
                  class="subscription__input"
                  type="number" min="0" step="0.01" name="subscribePrice"
                  v-model="localUser.subscribePrice"
                  :disabled="!user.canEarn"
                >
              </span>
            </label>

            <label class="form-group-inner subscription" v-if="!user.canEarn">
              <span class="label"></span>
              <span class="subscription-desc">
                Before setting your monthly subscription price (or to be able to accept tips), you must first
                <router-link to="/settings/payouts">add a bank account</router-link>
              </span>
            </label>

          </div>
        </div>
      </div>
      <div class="form-title border-top">
        <div class="inner"><span class="semi-transparent">
			Private Information
			<p class="subtext">This information will not be publicly displayed</p>
		</span></div>
      </div>
      <div class="shadow-block">
        <div class="container">
          <div class="form-group form-group_with-label gender-options">
            <label class="form-group-inner">
              <span class="label">Gender</span>
              <div class="row">
                <div class="col-1-2">
                  <div class="select-wrapper">
                    <select name="gender" class="default-disabled" v-model="localUser.gender">
                      <option value="0">Not specified</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div class="form-group form-group_with-label hidden-mobile">
            <div class="form-group-inner">
              <span class="label"></span>
              <button
                type="submit" class="btn lg saveChanges"
                :disabled="loading || !changed"
              >Save changes</button>
            </div>
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

export default {
  name: "ProfileSettingsContent",

  mixins: [Common],

  components: {
    ColorSelect,
    TextareaAutosize
  },

  methods: {
    colorsChanged() {
      this.$store.dispatch("auth/extendUser", {
        primaryColor: this.localUser.primaryColor,
        secondColor: this.localUser.secondColor
      });
      this.$store.dispatch("profile/update", this.localUser);
    }
  },

  computed: {
    about() {
      if (!this.localUser) {
        return null;
      }
      return this.localUser.about;
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
  },

  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const signup = urlParams.get("signup");
    if (signup) {
      setTimeout(() => {
        this.$refs.username.focus();
      }, 500);
    }

    this.localUser.about = this.localUser.about.replace(
      new RegExp("<br />", "g"),
      ""
    );
  }
};
</script>
