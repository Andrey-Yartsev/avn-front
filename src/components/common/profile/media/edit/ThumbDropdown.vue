<template>
  <div class="more-functions__dropdown-inside">
    <ul class="more-functions__list">
      <li class="more-functions__item">
        <button
          class="more-functions__link"
          type="button"
          @click="addThumb"
          :disabled="!showThumbOption"
        >
          <span class="more-functions__option">Add custom cover</span>
        </button>
      </li>
      <li class="more-functions__item">
        <button
          class="more-functions__link"
          type="button"
          @click="addPreview"
          :disabled="!showPreviewOption"
        >
          <span class="more-functions__option">Add video preview</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ThumbDropdown",
  computed: {},
  props: {
    hide: {
      type: Function
    },
    showThumbOption: Boolean,
    showPreviewOption: Boolean
  },
  methods: {
    addThumb() {
      this.$props.hide();
      this.$emit("addThumb");
    },
    addPreview() {
      this.$props.hide();
      this.$emit("addPreview");
    }
  }
};
</script>
