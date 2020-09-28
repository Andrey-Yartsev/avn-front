<template>
  <div class="loader-infinity" v-if="userInfoLoading">
    <Loader :fullscreen="false" :inline="true" text="" :small="true" />
  </div>
  <form @submit.prevent="subscribe" class="reasons" v-else>
    <div class="form-group form-group_with-label">
      <TextField
        id="firstName"
        label="First Name"
        v-model="userInfo.firstName"
      />
      <TextField id="lastName" label="Last Name" v-model="userInfo.lastName" />
      <TextField id="address" label="Address" v-model="userInfo.address" />
      <TextField
        id="address2"
        label="Address 2"
        v-model="userInfo.address2"
        :required="false"
      />
      <TextField id="city" label="City" v-model="userInfo.city" />
      <TextField id="zip" label="ZIP" v-model="userInfo.zip" />

      <label class="form-group-inner">
        <span class="label country-select__label"
          >Country<span class="red">*</span></span
        >
        <span class="select-wrapper">
          <select
            name="country"
            v-model="userInfo.countryId"
            @change="resetStateId"
          >
            <option v-for="v in countries" :key="v.id" :value="v.id">{{
              v.name
            }}</option>
          </select>
        </span>
      </label>

      <label class="form-group-inner" v-if="hasStates">
        <span class="label country-select__label"
          >State/Region<span class="red">*</span></span
        >
        <span class="select-wrapper">
          <select name="state" v-model="userInfo.stateId">
            <option v-for="v in states" :key="v.id" :value="v.id">{{
              v.name
            }}</option>
          </select>
        </span>
      </label>

      <div class="form-group-inner kinds">
        <span class="label country-select__label">Magazines</span>
        <label
          class="form-group-inner"
          v-for="kind in kindOptions"
          :key="kind.name"
        >
          <div class="checkbox-wrapper" :class="{ disabled: kindsDisabled }">
            <input
              type="checkbox"
              name="magazines"
              v-model="userInfo.kinds"
              :value="kind"
              :disabled="kindsDisabled"
            />
            <span class="label icn-item">{{ kind.title }}</span>
          </div>
        </label>
      </div>
      <div class="input-help hint-text-sm subtitle" v-if="false && !valid">
        Fill in all required fields to enable AVN Magazine subscription
      </div>
      <div class="form-group bottom-buttons">
        <button class="btn btn_fix-width-lg" :disabled="disabled">
          {{ submitTitle }}
        </button>
      </div>
      <div v-if="autoPopup" class="form-group ">
        <button class="btn btn_fix-width-lg alt" @click.prevent="reject">
          No, thank you
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import TextField from "./TextField";
import UserInfo from "./userInfo";
import Kinds from "./kinds";
import Loader from "@/components/common/Loader";

export default {
  name: "MagShippingForm",
  mixins: [UserInfo, Kinds],
  components: {
    TextField,
    Loader
  },
  props: {
    autoPopup: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    valid() {
      const required = [
        "firstName",
        "lastName",
        "address",
        "city",
        "zip",
        "countryId",
        "stateId"
      ];
      for (let name of required) {
        if (!this.userInfo[name]) {
          return false;
        }
      }
      return true;
    },
    disabled() {
      if (!this.valid) {
        return true;
      }
      if (this.countriesLoading) {
        return true;
      }
      if (this.statesLoading) {
        return true;
      }
      if (this.inProgress) {
        return true;
      }
      return false;
    },
    curData() {
      return this.$store.state.magazine.fetchShippingResult;
    },
    hasShipping() {
      return this.curData && this.curData.id;
    },
    subscribed() {
      return this.hasShipping && this.curData.hasOfflineSubscription;
    },
    inProgress() {
      return this.$store.state.magazine.updateLoading;
    },
    kindsDisabled() {
      return this.kindOptions.length < 2;
    },
    submitTitle() {
      return this.hasShipping ? "Update" : "Activate";
    }
  },
  watch: {
    disabled(disabled) {
      this.$emit("disabledChange", disabled);
    }
  },
  methods: {
    subscribe() {
      if (this.hasShipping) {
        this.$store
          .dispatch("magazine/updateShippingForm", this.userInfo)
          .then(() => {
            this.$store.commit("magazine/trigOfflineSubscription");
            this.$emit("close");
          });
      } else {
        this.$store
          .dispatch("magazine/updateShippingForm", this.userInfo)
          .then(() => {
            this.$store.commit("magazine/trigOfflineSubscription");
            this.$emit("close");
          });
      }
    },
    resetStateId() {
      this.userInfo.stateId = 0;
    },
    reject() {
      this.$store
        .dispatch("magazine/rejectAutoOfflineSubscription")
        .then(() => {
          this.$emit("close");
        });
    }
  },
  mounted() {
    this.$emit("disabledChange", true);
  }
};
</script>
