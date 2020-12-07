<template>
  <Loader v-if="scriptsLoading" :fullscreen="false" :inline="true" />
  <div class="boxes" v-else>
    {{ currentPeriodType }}<br /><br />
    <div class="cols">
      <div class="col col-1-3">
        <div class="box" id="followers-box">
          <div class="charts-wrapper-outer">
            <div class="charts-data">
              <div
                class="tab-stat tab-uploaded"
                @click="selectLine('followers-followers')"
                :class="{
                  selected:
                    selectedLineChart === 'followers' &&
                    selectedLineName === 'followers'
                }"
                ref="count_followers_current_followers"
              >
                <div class="tab-stat__name">Followers</div>
                <span>0</span>
              </div>
              <div
                class="tab-stat tab-views"
                @click="selectLine('followers-subscribers')"
                :class="{
                  selected:
                    selectedLineChart === 'followers' &&
                    selectedLineName === 'subscribers'
                }"
                ref="count_followers_current_subscribers"
              >
                <div class="tab-stat__name">Subscribers</div>
                <span>0</span>
              </div>
            </div>
            <div
              id="followers_chart"
              class="charts-wrapper charts-wrapper_followers"
            ></div>
            <div class="statistics-chart-scale" id="followers_scale"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUnixTime } from "date-fns";
import Loader from "@/components/common/Loader";
import LoadScriptsMixin from "@/components/statistics/mixins/loadScripts";
import BuildScaleMixin from "@/components/statistics/mixins/buildScale";
import ChartBuildingMixin from "@/components/statistics/mixins/chartBuilding";
import ChartDataMixin from "@/components/statistics/mixins/chartData";

export default {
  mixins: [
    LoadScriptsMixin,
    BuildScaleMixin,
    ChartBuildingMixin,
    ChartDataMixin
  ],
  components: {
    Loader
  },
  data() {
    return {
      currentPeriodType: "weekly",
      selectedLineChart: "",
      selectedLineName: ""
    };
  },
  methods: {
    selectLine() {
      // dummy
    },
    _buildScale() {
      const now = getUnixTime(new Date());
      this.buildScale(
        document.getElementById("followers_scale"),
        this.currentPeriodType,
        now
      );
    },
    sendWsRequests() {
      this.subscribeUserStatistics(
        "current_followers_detailed_histogram_" + this.currentPeriodType
      );
      // this.subscribeUserStatistics(
      //   "current_subscribers_detailed_histogram_" + this.currentPeriodType
      // );
    }
  },
  mounted() {
    setTimeout(() => {
      this._buildScale();
      this.buildChart("followers");
      this.fillLineChartByEmptyPoints("followers");
      this.initWs();
    }, 1000);
  }
};
</script>
