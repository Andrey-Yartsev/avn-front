<template>
  <div>
    <h1 class="form-title" v-if="$mq === 'desktop'">
      Free Trials
    </h1>
    <div class="trialsSectionCollection">
      <UserSearchField />
    </div>
  </div>
</template>

<script>
import Common from "../common";
import UserSearchField from "./UserSearchField";

export default {
  name: "StorySettingsContent",
  mixins: [Common],
  components: {
    UserSearchField
  }
};
</script>
