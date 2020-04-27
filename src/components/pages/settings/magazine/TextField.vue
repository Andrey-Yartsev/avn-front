<template>
  <label class="form-group-inner">
    <span class="label"
      >{{ label }}<span class="red" v-if="required">*</span></span
    >
    <span class="form-group form-group_clear-gaps">
      <span class="form-field">
        <input
          :maxlength="maxlength"
          :id="id"
          :value="value"
          :required="required"
          @input="updateValue($event.target.value)"
        />
      </span>
    </span>
  </label>
</template>

<script>
export default {
  props: {
    id: {
      type: String
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: String
    },
    required: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number,
      default: 70
    }
  },
  methods: {
    updateValue: function(value) {
      this.$emit("input", value);
    }
  }
};
</script>
