<template>
  <form @submit.prevent="subscribe">
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
      <TextField id="city" label="City" v-model="userInfo.firstName" />
      <TextField id="zip" label="ZIP" v-model="userInfo.zip" />

      <label class="form-group-inner">
        <span class="label country-select__label">Country</span>
        <span class="select-wrapper">
          <select
            name="country"
            v-validate="'required'"
            v-model="userInfo.countryId"
          >
            <option v-for="v in countries" :key="v.id" :value="v.id">{{
              v.name
            }}</option>
          </select>
        </span>
      </label>

      <label class="form-group-inner" v-if="hasStates">
        <span class="label country-select__label">State</span>
        <span class="select-wrapper">
          <select
            name="state"
            v-validate="'required'"
            v-model="userInfo.stateId"
          >
            <option v-for="v in states" :key="v.id" :value="v.id">{{
              v.name
            }}</option>
          </select>
        </span>
      </label>
    </div>
    <div class="form-group-btn hidden-mobile">
      <button type="submit" :disabled="disabled" class="btn lg btn_fix-width">
        Subscribe
      </button>
    </div>
  </form>
</template>

<script>
import TextField from "./TextField";
import States from "./states";

export default {
  name: "MagSubsForm",
  mixins: [States],
  components: {
    TextField
  },
  data() {
    return {
      userInfo: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        city: "",
        zip: "",
        countryId: "",
        stateId: ""
      }
    };
  },
  computed: {
    disabled() {
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
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    subscribe() {
      this.$store.dispatch("magazine/subscribe", this.userInfo);
    },
    curData() {
      return this.$store.state.magazine.fetchStatusResult.shipping;
    }
  },
  mounted() {
    this.$store.dispatch("payouts/legal/fetch").then(r => {
      this.userInfo = Object.assign(this.userInfo, r);
      if (!this.curData.id) {
        this.userInfo.countryId = this.defaultCountryId;
      }
      this.userInfo.zip = r.postalCode;
    });
  }
};
</script>
