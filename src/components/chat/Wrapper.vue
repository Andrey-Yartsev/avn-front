<template>
  <div class="chatCollectionView">
    <div class="chatCollectionContent" :class="{chat: isSecondScreen}">
      <div class="chatCollectionContent__col chatCollectionContent__col_narrow">
        <div class="chat-container">
          <slot name="col1"></slot>
        </div>
      </div>
      <div class="chatCollectionContent__col chatCollectionContent__col_wide">
        <slot name="col2"></slot>
      </div>
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isSecondScreen() {
      if (this.$store.state.chat.isSecondScreen) {
        return true;
      }
      if (parseInt(this.$route.params.userId)) {
        return true;
      }
      return false;
    }
  }
};
</script>
