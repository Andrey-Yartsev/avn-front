<template>
  <div class="fontSizeControls">
    <span class="button decrease" @click="dec">-</span>
    <span class="button increase" @click="inc">+</span>
  </div>
</template>

<script>
export default {
  props: ["fontSize"],
  methods: {
    inc() {
      this.$emit("increase");
    },
    dec() {
      this.$emit("decrease");
    }
  }
};
</script>

<style lang="scss" scoped>
.fontSizeControls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.button {
  position: relative;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  background-color: #80808059;
  &:hover {
    background-color: #808080a1;
  }
}
</style>
