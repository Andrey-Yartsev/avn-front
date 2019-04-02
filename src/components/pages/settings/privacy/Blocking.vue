<template>
  <div>
    <div class="form-title border-top">
      <div class="inner">
        <span class="semi-transparent">
          IP & Geo Blocking
        </span>
      </div>
    </div>
    <div class="shadow-block">
      <div class="container">
        <div class="form-group form-group_with-label">
          <div class="form-group-inner">
            <span class="label">By Country</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                <multiselect
                  v-model="selectedCountries"
                  :options="countries"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Pick some"
                  label="title"
                  track-by="title"
                  :preselect-first="true"
                  :taggable="true"
                  @input="countriesChange"
                >
                  <template
                    slot="selection"
                    slot-scope="{ values, search, isOpen }"
                  >
                    <span
                      class="multiselect__single"
                      v-if="values.length &amp;&amp;
                      !isOpen"
                      >{{ values.length }} options selected</span
                    ></template
                  >
                </multiselect>
              </span>
            </span>
          </div>
        </div>
        <div class="form-group form-group_with-label">
          <label class="form-group-inner">
            <span class="label">By IP</span>
            <span
              class="form-group form-group_clear-gaps"
              :class="{ 'field-invalid': fieldError('ips') }"
            >
              <span class="form-field">
                <textarea
                  rows="3"
                  name="ips"
                  :minHeight="50"
                  :maxHeight="200"
                  v-model="ips"
                  @input="ipsTextChange"
                  v-validate="'ips'"
                  data-vv-validate-on="blur"
                ></textarea>
                <div class="error-info" v-if="fieldError('ips')">
                  {{ fieldError("ips") }}
                </div>
              </span>
            </span>
          </label>
          <div class="input-help">list IPS separating by commas</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import { Validator, ValidationProvider } from "vee-validate";
import Form from "@/mixins/form";

const validateIPaddress = ipaddress => {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  return false;
};

Validator.extend("ips", {
  getMessage: field => "The " + field + " value is not valid IPs",
  validate: value => {
    if (!value) {
      return true;
    }
    const ips = value.split(",").map(v => v.trim());
    return ips.every(ip => {
      return validateIPaddress(ip);
    });
  }
});

export default {
  name: "PrivacySettingsBlocking",
  mixins: [Form],
  components: { Multiselect, TextareaAutosize, ValidationProvider },
  props: {
    localUser: Object
  },
  data() {
    return {
      ips: "",
      selectedCountries: []
    };
  },
  computed: {
    countries() {
      if (!this.$store.state.countries.items) {
        return [];
      }
      return Object.entries(this.$store.state.countries.items).map(v => {
        return {
          id: v[0],
          title: v[1]
        };
      });
    }
  },
  methods: {
    countriesChange(countries) {
      this.$emit("change", { blockedCountries: countries.map(v => v.id) });
    },
    parseIpsText(e) {
      const text = e.target.value;
      return text.split(",").map(v => v.trim());
    },
    ipsTextChange(text) {
      if (!text) {
        this.$emit("change", { blockedIps: "" });
        return;
      }
      console.log(this.parseIpsText(text));
      this.$emit("change", { blockedIps: this.parseIpsText(text) });
    }
  },
  watch: {
    countries(countries) {
      if (
        !this.localUser.blockedCountries ||
        !this.localUser.blockedCountries.length
      ) {
        return;
      }
      this.selectedCountries = this.localUser.blockedCountries.map(id => {
        return countries.find(v => v.id === id);
      });
    }
  },
  mounted() {
    this.$store.dispatch("countries/fetch");
    if (this.localUser.blockedIps) {
      this.ips = this.localUser.blockedIps.join(", ");
    }
    //
    // this.ips =
    // this.localUser.blockedIps;
    // if (this.localUser.blockedCountries.length)
    //  = this.localUser.blockedCountries;
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
