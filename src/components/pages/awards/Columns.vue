<template>
  <div class="row awards">
    <div class="awards__col" v-for="(col, i) in categories" :key="i">
      <label class="form-group form-group_row-md" v-for="v in col" :key="v.id">
        <span class="label label_row">{{ v.title }}{{ v.id }}</span>
        <span class="form-group form-group_clear-gaps">
          <span class="form-field">
            <input
              type="text"
              :placeholder="v.title"
              :value="value"
              :disabled="disabled"
              @input="
                e => {
                  input(e, v);
                }
              "
            />
          </span>
        </span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: Array,
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    input(e, v) {
      this.$emit("input", {
        id: v.id,
        value: e.data
      });
    }
  }
};
</script>
