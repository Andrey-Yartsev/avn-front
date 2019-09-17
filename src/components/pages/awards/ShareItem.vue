<template>
  <label class="form-group form-group_row-md">
    <span class="label label_row">{{ v.title }}</span>
    <span class="form-group form-group_clear-gaps">
      <span class="form-field">
        <textarea v-model="text"></textarea>
        <button
          type="button"
          class="btn btn_fix-width-sm border alt btn-copy"
          @click="copyToClipboard(v.category.id)"
        >
          Copy
        </button>
      </span>
    </span>
  </label>
</template>

<script>
export default {
  name: "NominationShareItem",
  props: {
    v: Object
  },
  data() {
    return {
      text: `I just pre-nominated ${this.v.name} for ${
        this.v.category.title
      } @AVNAwards on AVNStars.com`
    };
  },
  methods: {
    copyToClipboard() {
      this.$copyText(this.text).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "Twitter text copied!"
        });
      });
    }
  }
};
</script>
