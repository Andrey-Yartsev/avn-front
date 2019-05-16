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
        <input
          v-if="!v.values"
          :name="v.code"
          v-model="localBank[v.code]"
          v-validate="'required'"
          @input="changed"
        />
        <span class="select-wrapper" v-else>
          <select @input="changed" :name="v.code" v-model="localBank[v.code]">
            <option v-for="vv in v.values" :key="vv.key" :value="vv.key">{{
              vv.value
            }}</option>
          </select>
        </span>
      </label>
    </div>
    <div class="form-group form-group_with-label">
      <div class="input-status">All fields is required</div>
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
  }
};
</script>
