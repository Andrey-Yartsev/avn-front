<template>
  <div class="switcher-font-options" :class="{ opened: opened }">
    <div class="button-font button-font_switcher" @click="open"></div>
    <div class="switcher-font-options__sizes">
      <span class="button-font button-font_decrease" @click="dec">-</span>
      <span class="button-font button-font_increase" @click="inc">+</span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    opened: false
  }),
  props: ["fontSize"],
  methods: {
    inc() {
      this.$store.commit("chat/changeFontSize", true);
    },
    dec() {
      this.$store.commit("chat/changeFontSize", false);
    },
    open() {
      this.opened = !this.opened;
    }
  }
};
</script>
