<template>
  <div class="geoblocking">
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
          <label class="form-group-inner">
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
          </label>
          <div class="input-help" v-if="selectedCountriesText">
            {{ selectedCountriesText }}
          </div>
        </div>
        <div
          class="form-group form-group_with-label"
          v-if="selectedCountries.length"
        >
          <label class="form-group-inner" v-if="states.length">
            <span class="label">By State</span>
            <span class="form-group form-group_clear-gaps">
              <div class="sm-text">
                Do not select if you want to block all country
              </div>
              <span
                class="form-field"
                v-for="state in states"
                :key="'states' + state.countryId"
              >
                <select
                  :ref="'states' + state.countryId"
                  class="msct"
                  :multiple="true"
                  @change="
                    event => {
                      statesChange(state.countryId, event);
                    }
                  "
                >
                  <option
                    :value="v.id"
                    v-for="v in state.states"
                    :selected="isStateSelected(v.id)"
                    :key="v.id"
                    >{{ v.title }}</option
                  >
                </select>
                <div class="sm-text">
                  {{ findCountry(state.countryId).title }}
                  <a href="#" @click.prevent="resetStates(state.countryId)"
                    >Clear</a
                  >
                </div>
              </span>
            </span>
          </label>
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
          <div class="input-help">List IPS separating by commas</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import Form from "@/mixins/form";
import StatesApi from "@/api/states";
import ipsValidator from "@/validator/ips";

export default {
  name: "PrivacySettingsBlocking",
  mixins: [Form],
  components: { Multiselect, TextareaAutosize },
  props: {
    localUser: Object
  },
  data() {
    return {
      ips: "",
      selectedCountries: [],
      selectedStates: {},
      allSelectedStates: [],
      states: []
    };
  },
  computed: {
    countries() {
      if (!this.$store.state.countries.items) {
        return [];
      }
      return this.$store.state.countries.items.map(v => {
        return {
          id: v.id,
          title: v.name,
          hasStates: v.hasStates
        };
      });
    },
    selectedCountriesText() {
      if (!this.selectedCountries || !this.selectedCountries.length) {
        return "";
      }
      return this.selectedCountries.map(v => v.title).join(", ");
    }
  },
  methods: {
    countriesChange(countries) {
      const ids = countries.map(v => v.id);
      // this

      Object.keys(this.selectedStates).forEach(key => {
        if (ids.indexOf(key) === -1) {
          this.selectedStates[key] = {};
        }
      });
      this.initAllStates();

      this.$emit("change", { blockedCountries: countries.map(v => v.id) });
    },
    getSelectValues(select) {
      const result = [];
      const options = select && select.options;
      let opt;

      for (let i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
          result.push(opt.value || opt.text);
        }
      }
      return result;
    },
    initAllStates() {
      let allStates = [];
      Object.values(this.selectedStates).forEach(values => {
        allStates = allStates.concat(values);
      });
      this.$emit("change", { blockedStates: allStates });
    },
    statesChange(countryId, event) {
      this.selectedStates[countryId] = this.getSelectValues(event.target);
      this.selectedStates = { ...this.selectedStates };
      this.initAllStates();
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
      this.$emit("change", { blockedIps: this.parseIpsText(text) });
    },
    selectAllStates(countryId) {
      this.selectedStates[countryId] = {};
      this.initAllStates();
      this.$refs["states" + countryId].removeAttr("selected");
    },
    fetchStates() {
      const fetchStates = [];
      this.selectedCountries.map(v => {
        if (!v.hasStates) {
          return;
        }

        fetchStates.push(
          new Promise(accept => {
            StatesApi.fetch(v.id).then(response => {
              accept({
                countryId: v.id,
                response
              });
            });
          })
        );

        this.states = [];

        Promise.all(fetchStates).then(results => {
          results.forEach(async result => {
            try {
              const response = await result.response.json();
              this.states.push({
                countryId: result.countryId,
                states: response.map(v => {
                  if (this.allSelectedStates.indexOf(v.id) !== -1) {
                    this.selectedStates[result.countryId].push(v.id);
                  }
                  return {
                    id: v.id,
                    title: v.name
                  };
                })
              });
            } catch (e) {
              e;
            }
          });
        });
      });
    },
    findCountry(id) {
      return this.countries.find(v => {
        return id === v.id;
      });
    },
    isStateSelected(id) {
      return this.allSelectedStates.indexOf(id) !== -1;
    },
    resetStates(countryId) {
      this.selectedStates[countryId] = {};
      this.initAllStates();
      this.resetSelectElement(this.$refs["states" + countryId][0]);
    },
    resetSelectElement(selectElement) {
      selectElement.selectedIndex = -1;
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
      this.selectedCountries = this.selectedCountries.filter(v => !!v);
    },
    selectedCountries() {
      this.selectedCountries.forEach(v => {
        if (v.hasStates) {
          this.selectedStates[v.id] = [];
        }
      });

      this.fetchStates();
    }
  },
  mounted() {
    this.$store.dispatch("countries/fetch");
    if (this.localUser.blockedIps) {
      this.ips = this.localUser.blockedIps.join(", ");
    }

    if (this.localUser.blockedStates && this.localUser.blockedStates.length) {
      this.allSelectedStates = this.localUser.blockedStates;
    }
  },
  created() {
    this.$validator.extend("ips", ipsValidator);
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
