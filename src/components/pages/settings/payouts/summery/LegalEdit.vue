<template>
  <div class="border-top border-top_reset-bt-desk">
    <div class="form-title form-title_psides-reset">
      <div class="inner">
        <div class="semi-transparent">
          Edit Personal Information
        </div>
        <button @click="$emit('cancel')">
          Cancel
        </button>
      </div>
    </div>
    <div class="loader-infinity" v-if="statesLoading">
      <Loader :fullscreen="false" text="" :inline="true" :small="true" />
    </div>

    <form class="payouts-legal-form" v-on:submit.stop.prevent="save">
      <div class="form-group form-group_with-label">
        <label class="form-group-inner">
          <span class="label">Address</span>
          <input
            name="address"
            v-model="localLegal.address"
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
                  v-model="localLegal.city"
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
                  v-model="localLegal.postalCode"
                  required
                  id="input-cvv"
                  v-validate="'required'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group form-group_with-label" v-if="hasStates">
        <label class="form-group-inner" for="state">
          <span class="label">State</span>
          <span class="select-wrapper">
            <select
              id="state"
              name="state"
              required
              v-model="localLegal.state"
              v-validate="'required'"
            >
              <option value="">Select State</option>
              <option :value="v.title" v-for="v in states" :key="v.id">{{
                v.title
              }}</option>
            </select>
          </span>
        </label>
      </div>
      <div class="form-group-btn form-group-btn_reset-pb-desk">
        <button
          type="submit"
          class="btn lg btn_fix-width"
          :disabled="!changed || !isFormValid || saving"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import StatesMixin from "@/components/pages/settings/payouts/mixins/states";
import Loader from "@/components/common/Loader";
import Form from "@/mixins/form";

export default {
  mixins: [StatesMixin, Form],
  components: { Loader },
  data() {
    return {
      localLegal: null,
      saving: false
    };
  },
  computed: {
    legal() {
      return this.$store.state.payouts.legal.fetchResult;
    },
    changed() {
      return JSON.stringify(this.legal) !== JSON.stringify(this.localLegal);
    }
  },
  methods: {
    save() {
      this.saving = true;

      const data = {};
      ["address", "city", "postalCode", "state"].forEach(k => {
        data[k] = this.localLegal[k];
      });

      this.$store.dispatch("payouts/legal/save", { data }).then(r => {
        if (r.error) {
          return;
        }
        this.$store.dispatch("global/flashToast", {
          text: "Personal info saved successfully"
        });
        this.saving = false;
        this.$emit("cancel");
      });
    },
    _clone(o) {
      return JSON.parse(JSON.stringify(o));
    }
  },
  created() {
    this.localLegal = this._clone(this.legal);
  }
};
</script>
