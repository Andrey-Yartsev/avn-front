<template>
  <div class="contest-settings">
    <h1
      class="form-title hidden-mobile settings-title"
      v-if="$mq === 'desktop'"
    >
      Contests
    </h1>
    <div class="container shadow-block cards">
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
        <template v-else>
          <div class="contest-table info ">
            <h2 class="form-title contests-header border-top">
              Available Contests
            </h2>
            <template v-if="activeContests && activeContests.length">
              <div class="contest-table-head contest-table-row">
                <div class="contest-row-name">Contest</div>
                <div class="contest-row-rank">Rank</div>
                <div class="contest-row-toggler"></div>
              </div>
              <Contest :data="v" v-for="v in activeContests" :key="v.id" />
            </template>
            <div v-else class="contest-table-empty">
              <span>There is no available contests for now</span>
            </div>
          </div>
          <div class="contest-table info ">
            <h2 class="form-title contests-header border-top">
              Past Contests
            </h2>
            <template v-if="finishedContests && finishedContests.length">
              <div class="contest-table-head contest-table-row">
                <div class="contest-row-name">Contest</div>
                <div class="contest-row-rank">Rank</div>
                <div class="contest-row-toggler"></div>
              </div>
              <Contest :data="v" v-for="v in finishedContests" :key="v.id" />
            </template>
            <div v-else class="contest-table-empty">
              <span>There is no available contests for now</span>
            </div>
          </div>
        </template>
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
    },
    activeContests() {
      return this.items.filter(item => !item.hasFinished);
    },
    finishedContests() {
      return this.items.filter(item => item.hasFinished);
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
