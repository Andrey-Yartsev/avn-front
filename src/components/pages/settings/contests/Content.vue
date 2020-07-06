<template>
  <div class="contest-settings">
    <h1
      class="form-title hidden-mobile settings-title"
      v-if="$mq === 'desktop'"
    >
      Contests
    </h1>
    <div class="container shadow-block border-top cards">
      <div class="loader-container" v-if="loading">
        <Loader :fullscreen="false" text="" :small="true" />
      </div>
      <template v-else>
        <div class="form-title" v-if="items && !items.length">
          <div class="inner">
            <div class="semi-transparent">
              There is no available contests for now
            </div>
          </div>
        </div>
        <div v-else class="contest-table info">
          <div class="contest-table-head contest-table-row">
            <div class="contest-row-name">Contest</div>
            <div class="contest-row-rank">Rank</div>
            <div class="contest-row-toggler"></div>
          </div>
          <template v-if="items && items.length">
            <Contest :data="v" v-for="v in items" :key="v.id" />
          </template>
          <div class="contest-table-empty" v-else>
            <span>Empty here for now</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Contest from "./Contest";
import Loader from "@/components/common/Loader";

export default {
  name: "ContestsSettingsContent",
  components: {
    Contest,
    Loader
  },
  data() {
    return {
      loading: true
    };
  },
  computed: {
    items() {
      return this.$store.state.contest.settings.fetchResult;
    }
  },
  mounted() {
    this.$store
      .dispatch("contest/settings/fetch")
      .then()
      .catch()
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>
