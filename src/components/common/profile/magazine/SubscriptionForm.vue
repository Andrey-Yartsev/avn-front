<template>
  <form>
    <div class="form-group form-group_with-label">
      <TextField
        id="firstName"
        label="First Name"
        v-model="userinfo.firstName"
      />
      <TextField id="lastName" label="Last Name" />
      <TextField id="address" label="Address" />
      <TextField id="address2" label="Address 2" />
      <TextField id="city" label="City" />

      <label class="form-group-inner">
        <span class="label country-select__label">Country</span>
        <span class="select-wrapper">
          <select
            name="country"
            v-validate="'required'"
            v-model="userinfo.country"
          >
            <option v-for="v in countries" :key="v.id" :value="v.code">{{
              v.name
            }}</option>
          </select>
        </span>
      </label>

      <label class="form-group-inner" v-if="hasStates">
        <span class="label country-select__label">State</span>
        <span class="select-wrapper">
          <select name="state" v-validate="'required'" v-model="userinfo.state">
            <option v-for="v in states" :key="v.id" :value="v.id">{{
              v.name
            }}</option>
          </select>
        </span>
      </label>
    </div>
    <div class="form-group-btn hidden-mobile">
      <button type="submit" disabled="disabled" class="btn lg btn_fix-width">
        Send
      </button>
    </div>
  </form>
</template>

<script>
import TextField from "./TextField";
import States from "@/components/pages/settings/payments/states";

export default {
  name: "MagSubsForm",
  mixins: [States],
  components: {
    TextField
  },
  data() {
    return {
      userinfo: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: ""
      }
    };
  },
  mounted() {
    this.$store.dispatch("countries/fetch");
    // this.$store.dispatch("states/fetch");
  }
};
</script>
