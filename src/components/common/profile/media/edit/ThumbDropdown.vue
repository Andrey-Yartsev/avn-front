<template>
  <div class="more-functions__dropdown-inside">
    <ul class="more-functions__list">
      <li class="more-functions__item">
        <button class="more-functions__link" type="button" @click="addThumb">
          <span class="more-functions__option">Add custom thumb</span>
        </button>
      </li>
      <li class="more-functions__item">
        <button
          class="more-functions__link"
          type="button"
          disabled
          @click="addPreview"
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
    }
  },
  methods: {
    addThumb() {
      this.$props.hide();
      this.$emit("addThumb");
    },
    addPreview() {
      this.$props.hide();
    }
  }
};
</script>
