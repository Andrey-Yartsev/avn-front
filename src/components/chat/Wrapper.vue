<template>
  <div class="chatCollectionView">
    <div class="chatCollectionContent" :class="{chat: isSecondScreen}">
      <div class="chatHeader">
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
  </div>
</template>

<script>
import ModalRouterParams from "@/mixins/modalRouter/params";

export default {
  name: "ChatWrapper",

  mixins: [ModalRouterParams],

  computed: {
    isSecondScreen() {
      if (this.$store.state.chat.isSecondScreen) {
        return true;
      }
      return !!parseInt(this.routeParams.userId);
    }
  }
};
</script>
