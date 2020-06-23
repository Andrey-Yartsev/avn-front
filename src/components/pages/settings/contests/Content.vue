<template>
  <div class="contest-settings">
    <h1
      class="form-title hidden-mobile settings-title"
      v-if="$mq === 'desktop'"
    >
      Desktop Contests
    </h1>
    <div class="container shadow-block border-top cards shadow-block_reset-pt">
      <table class="info">
        <tr>
          <th>Contest</th>
          <th>Rank</th>
          <th>Date Range</th>
          <th class="toggler"></th>
        </tr>
        <template v-if="items && items.length">
          <Contest :data="v" v-for="v in items" :key="v.id" />
        </template>
        <tr v-else>
          <td colspan="4">Empty here for now</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Contest from "./Contest";

export default {
  name: "ContestsSettingsContent",
  components: {
    Contest
  },
  computed: {
    items() {
      return this.$store.state.contest.settings.fetchResult;
    }
  },
  mounted() {
    this.$store.dispatch("contest/settings/fetch");
  }
};
</script>
