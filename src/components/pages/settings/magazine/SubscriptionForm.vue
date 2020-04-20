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
      <TextField id="city" label="City" v-model="userInfo.city" />
      <TextField id="zip" label="ZIP" v-model="userInfo.zip" />

      <label class="form-group-inner">
        <span class="label country-select__label">Country</span>
        <span class="select-wrapper">
          <select
            name="country"
            v-validate="'required'"
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

      <div
        class="form-group-inner kinds"
        :class="{ disabled: kindOptions.length < 2 }"
      >
        <span class="label country-select__label">Magazines</span>
        <label
          class="form-group-inner"
          v-for="kind in kindOptions"
          :key="kind.name"
        >
          <div class="checkbox-wrapper">
            <input
              type="checkbox"
              name="magazines"
              v-model="userInfo.kinds"
              :value="kind"
            />
            <span class="label icn-item">{{ kind.title }}</span>
          </div>
        </label>
      </div>
      <div class="input-help hint-text-sm subtitle" v-if="!valid">
        Fill in all fields to enable AVN Magazine subscription
      </div>
    </div>
  </form>
</template>

<script>
import TextField from "./TextField";
import States from "./states";
import Kinds from "./kinds";

export default {
  name: "MagSubsForm",
  mixins: [States, Kinds],
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
        stateId: "",
        kinds: []
      }
    };
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
      return this.$store.state.magazine.fetchStatusResult.shipping;
    },
    subscribed() {
      return (
        this.curData && this.curData.id && this.curData.hasOfflineSubscription
      );
    },
    inProgress() {
      return this.$store.state.magazine.updateLoading;
    }
  },
  watch: {
    disabled(disabled) {
      this.$emit("disabledChange", disabled);
    }
  },
  methods: {
    subscribe() {
      this.$store.dispatch("magazine/subscribe", this.userInfo);
    },
    resetStateId() {
      this.userInfo.stateId = 0;
    }
  },
  mounted() {
    this.$emit("disabledChange", true);
    this.$store.dispatch("payouts/legal/fetch").then(r => {
      if (!this.curData.id) {
        this.userInfo = Object.assign(this.userInfo, r);
        this.userInfo.countryId = this.defaultCountryId;
        this.userInfo.zip = r.postalCode;
      } else {
        this.userInfo = Object.assign(this.userInfo, this.curData);
        this.userInfo.countryId = this.curData.country.id;
        this.userInfo.stateId = this.curData.state.id;

        console.log(this.userInfo.magazines);
        this.userInfo.kinds = this.userInfo.magazines
          .map(name => {
            return this.kindOptions.find(kind => kind.name === name);
          })
          .filter(v => !!v);

        if (this.userInfo.kinds.length === 0) {
          this.userInfo.kinds = [this.kindOptions[0]];
        }
      }
    });
  }
};
</script>
