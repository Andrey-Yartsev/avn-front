import { periodTypeNames } from "@/components/statistics/utils";
import request from "@/utils/request";

const topFollowersStorage = {};
for (let periodType of periodTypeNames) {
  topFollowersStorage[periodType] = {};
}

// abstract: currentPeriodType

export default {
  methods: {
    async updateTopFollowers(statData) {
      let _ids = Object.keys(statData);
      if (!_ids.length) {
        return;
      }
      _ids = _ids.slice(0, 5);
      const ids = _ids.map(id => "ids[]=" + id);
      const response = await request(
        `users?access-token=` +
          this.$store.state.auth.token +
          "&" +
          ids.join("&"),
        {
          method: "GET"
        }
      );
      this.topFollowers = await response.json();
    },
    updateTopFollowersFromCache() {
      this.topFollowers = [];
      this.updateTopFollowers(topFollowersStorage[this.currentPeriodType]);
    },
    updateTopFollowersCache(statData) {
      topFollowersStorage[this.currentPeriodType] = statData;
    }
  },
  watch: {
    currentPeriodType() {
      this.updateTopFollowersFromCache();
    }
  }
};
