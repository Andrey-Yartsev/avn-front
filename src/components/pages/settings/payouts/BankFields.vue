<template>
  <div>
    <div
      class="form-group form-group_with-label"
      :class="{ 'field-invalid': fieldError(v.code) }"
      v-for="v in bankFields"
      :key="'f' + v.code"
    >
      <label class="form-group-inner">
        <span class="label">{{ v.label }}</span>
        <textarea
          v-if="v.type === 'textarea'"
          :name="v.code"
          v-model="localBank[v.code]"
          v-validate="'required'"
          @input="changed"
          :disabled="!!v.onlyRead"
        >
        </textarea>
        <input
          v-else-if="!v.values"
          :name="v.code"
          v-model="localBank[v.code]"
          v-validate="'required'"
          @input="changed"
          :disabled="!!v.onlyRead"
          v-mask="v.inputMaskRegex ? v.inputMaskRegex : ''"
          :placeholder="v.inputMaskPlaceholder ? v.inputMaskPlaceholder : ''"
          :maxlength="v.maxLength || 255"
        />
        <span class="select-wrapper" v-else>
          <select
            @input="changed"
            :name="v.code"
            v-model="localBank[v.code]"
            v-validate="'required'"
            :disabled="!!v.onlyRead"
          >
            <option v-for="vv in v.values" :key="vv.key" :value="vv.key">{{
              vv.value
            }}</option>
          </select>
        </span>
      </label>
      <div class="help-input" v-if="v.description" v-html="v.description"></div>
    </div>
    <div class="form-group form-group_help-fields form-group_with-label">
      <div class="input-help hint-text-sm" v-if="bankFields.length">
        All fields is required
      </div>
    </div>
  </div>
</template>

<script>
import Form from "@/mixins/form";

export default {
  name: "BankFields",
  mixins: [Form],
  props: {
    bankFields: {
      type: Array,
      required: true
    },
    localBank: {
      type: Object,
      required: true
    }
  },
  methods: {
    changed() {
      setTimeout(() => {
        this.$emit("change");
      }, 10);
    }
  },
  watch: {
    isFormValid(isFormValid) {
      this.$emit("validChange", isFormValid);
    }
  },
  mounted() {
    this.$emit("validChange", this.isFormValid);
  }
};
</script>
