<template>
  <Loader v-if="scriptsLoading" :fullscreen="false" :inline="true" />
  <div class="boxes" v-else>
    {{ currentPeriodType }}<br /><br />
    <div class="cols">
      <div class="col col-1-2">
        <div class="box">
          <div class="charts-wrapper-outer">
            <div class="charts-data">
              <div
                class="tab-stat tab-posts"
                ref="count_earnings_paid_subscriptions"
              >
                Subscribers <span>0</span>
              </div>
              <div class="tab-stat tab-views" ref="count_earnings_tips">
                Tipping <span>0</span>
              </div>
              <div
                class="tab-stat tab-likes"
                ref="count_earnings_paid_chat_messages"
              >
                Message <span>0</span>
              </div>
              <div
                class="tab-stat tab-comments"
                ref="count_earnings_earn_referral"
              >
                Referrals <span>0</span>
              </div>
            </div>
            <div
              id="earnings_chart"
              class="charts-wrapper charts-wrapper_posts"
            ></div>
            <div class="statistics-chart-scale" id="earnings_scale"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import LoadScripts from "./loadScripts";
import BuildScale from "./buildScale";
import moment from "moment";
import ChartBuilding from "./chartBuilding";
import ChartData from "./chartData";

export default {
  mixins: [LoadScripts, BuildScale, ChartBuilding, ChartData],
  components: {
    Loader
  },
  data() {
    return {
      currentPeriodType: "all",
      selectedLineChart: "",
      selectedLineName: ""
    };
  },
  methods: {
    selectLine() {
      // dummy
    },
    _buildScale() {
      const now = moment()
        .utc()
        .unix();
      this.buildScale(
        document.getElementById("earnings_scale"),
        this.currentPeriodType,
        now
      );
    },
    sendWsRequests() {
      this.subscribeUserStatistics(
        "tips_detailed_histogram_" + this.currentPeriodType
      );
      this.subscribeUserStatistics(
        "paid_chat_messages_detailed_histogram_" + this.currentPeriodType
      );

      // this.subscribeUserStatistics(
      //   "current_subscribers_detailed_histogram_" + this.currentPeriodType
      // );
    }
  },
  mounted() {
    setTimeout(() => {
      this._buildScale();
      this.buildChart("earnings");
      this.fillLineChartByEmptyPoints("earnings");
      this.initWs();
    }, 1000);
  }
};
</script>
