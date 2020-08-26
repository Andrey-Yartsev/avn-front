<template>
  <div class="fl-height-content">
    <MobileHeader />

    <div class="boxes">
      <div class="page-header-title cols">
        <div class="col col-1-2">
          <div class="page-name">Statistics</div>
          <div
            class="more-functions"
            :class="{ open: periodOptionsOpened }"
            v-click-outside="
              () => {
                periodOptionsOpened = false;
              }
            "
          >
            <div
              class="more-functions__overlay"
              @click="periodOptionsOpened = false"
            ></div>
            <div
              class="more-functions__btn more-functions__btn_arrow"
              @click="periodOptionsOpened = !periodOptionsOpened"
            >
              <div class="more-functions__btn-text">
                {{ getPeriodType(currentPeriodType).title }}
              </div>
            </div>
            <div class="more-functions__dropdown">
              <div class="more-functions__dropdown-inside">
                <ul class="more-functions__list">
                  <li
                    v-for="v in periodTypes"
                    :key="v.name"
                    class="more-functions__item"
                  >
                    <button
                      type="button"
                      :disabled="v.name === currentPeriodType"
                      @click="selectPeriod(v.name)"
                      class="more-functions__link"
                    >
                      <span class="more-functions__option">
                        {{ v.title }}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="boxes">
      <!--
      <PostsModal
        v-if="$store.state.modal.statPosts.show"
        :dataSet="tempDataSet"
        @periodChange="postsPeriodChange"
        ref="postsModal"
      />
      -->

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
        <div class="col col-1-3">
          <div class="box" id="posts-box">
            <div class="charts-wrapper-outer">
              <div class="charts-data">
                <div
                  class="tab-stat tab-posts"
                  @click="selectLine('posts-posts')"
                  :class="{
                    selected:
                      selectedLineChart === 'posts' &&
                      selectedLineName === 'posts'
                  }"
                  ref="count_posts_new_post"
                >
                  <div class="tab-stat__name">Posts</div>
                  <span>0</span>
                </div>
                <div
                  class="tab-stat tab-views"
                  @click="selectLine('posts-views')"
                  :class="{
                    selected:
                      selectedLineChart === 'posts' &&
                      selectedLineName === 'views'
                  }"
                  ref="count_posts_view_post"
                >
                  <div class="tab-stat__name">Views</div>
                  <span>0</span>
                </div>
                <div
                  class="tab-stat tab-likes"
                  @click="selectLine('posts-likes')"
                  :class="{
                    selected:
                      selectedLineChart === 'posts' &&
                      selectedLineName === 'likes'
                  }"
                  ref="count_posts_post_like"
                >
                  <div class="tab-stat__name">Likes</div>
                  <span>0</span>
                </div>
                <div
                  class="tab-stat tab-comments"
                  @click="selectLine('posts-comments')"
                  :class="{
                    selected:
                      selectedLineChart === 'posts' &&
                      selectedLineName === 'comments'
                  }"
                  ref="count_posts_post_comment_added"
                >
                  <div class="tab-stat__name">Comments</div>
                  <span>0</span>
                </div>
              </div>
              <div
                id="posts_chart"
                class="charts-wrapper charts-wrapper_posts"
              ></div>
              <div class="statistics-chart-scale" id="posts_scale"></div>
            </div>
          </div>
        </div>
        <div class="col col-1-3">
          <div class="box" id="stories-box">
            <div class="charts-wrapper-outer">
              <div class="charts-data">
                <div
                  class="tab-stat tab-uploaded"
                  @click="selectLine('stories-uploads')"
                  :class="{
                    selected:
                      selectedLineChart === 'stories' &&
                      selectedLineName === 'uploads'
                  }"
                  ref="count_stories_story_added"
                >
                  <div class="tab-stat__name">Uploaded</div>
                  <span>0</span>
                </div>
                <div
                  class="tab-stat tab-views"
                  @click="selectLine('stories-views')"
                  :class="{
                    selected:
                      selectedLineChart === 'stories' &&
                      selectedLineName === 'views'
                  }"
                  ref="count_stories_story_view"
                >
                  <div class="tab-stat__name">Views</div>
                  <span>0</span>
                </div>
                <!--<span class=comments ref="chartsDataStoriesComments">Comments<span>0</span></span>-->
              </div>
              <div
                id="stories_chart"
                class="charts-wrapper charts-wrapper_stories"
              ></div>
              <div class="statistics-chart-scale" id="stories_scale"></div>
            </div>
          </div>
        </div>
      </div>

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
        <div class="col col-1-2">
          <div class="box">
            <MoneyTable
              :data="moneyTableData"
              :currentPeriodType="currentPeriodType"
              ref="moneyTable"
            />
          </div>
        </div>
      </div>

      <div class="cols">
        <div class="col col-2-3">
          <div class="box" id="visitors-box">
            <h3 class="box-title">
              Profile visitors
              <span class="chart_period">Today</span>
            </h3>
            <div class="charts-wrapper-outer charts-wrapper-outer__visitors">
              <div class="visitors-donuts-wrapper-outer">
                <div class="visitors-donuts-wrapper">
                  <div id="visitors_donut"></div>
                  <div class="visitors_data">
                    <div class="visitors_today">
                      Today <span ref="visitorsToday">0</span>
                    </div>
                    <div class="visitors_week">
                      Week <span ref="visitorsWeek">0</span>
                    </div>
                    <div class="visitors_total">
                      Total <span ref="visitorsTotal">0</span>
                    </div>
                  </div>
                </div>
                <div class="visitors-donuts-wrapper">
                  <div id="visitors_users_donut"></div>
                  <div class="visitors_data">
                    <div class="visitors_users">
                      Users <span ref="visitorsUsers">0</span>
                    </div>
                    <div class="visitors_guests">
                      Guests <span ref="visitorsGuests">0</span>
                    </div>
                  </div>
                </div>
                <div class="visitors-donuts-wrapper">
                  <div id="visitors_platform_donut"></div>
                  <div class="visitors_data">
                    <div class="visitors_mobile">
                      Mobile <span ref="visitorsMobile">0</span>
                    </div>
                    <div class="visitors_desktop">
                      Desktop <span ref="visitorsDesktop">0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div id="visitors_map"></div>
            </div>
          </div>
        </div>
        <div class="col col-1-3">
          <div class="box">
            <h3 class="box-title">
              Top 5
              <span class="chart_period">Today</span>
            </h3>
            <div class="box-body">
              <div class="swiper-container" id="statistics-top-swiper">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <h4>Followers</h4>
                    <div class="users-statistics" v-if="topFollowers">
                      <router-link
                        v-for="v in topFollowers"
                        v-bind:key="v.id"
                        class="user-statistics"
                        :to="'/' + v.username"
                      >
                        <span
                          class="avatar avatar_gap-r-sm avatar_sm"
                          :class="{ 'online-state': isOnline(v.id) }"
                        >
                          <span class="avatar__img">
                            <img :src="v.avatar" v-if="v.avatar" />
                          </span>
                        </span>
                        <div class="username-group">
                          <div class="user__name">
                            <div class="name">{{ v.name }}</div>
                          </div>
                          <span class="user-login reset-ml">{{
                            v.username
                          }}</span>
                        </div>
                      </router-link>
                    </div>
                  </div>
                  <!--<div class=swiper-slide>
								<h4>Tab 2</h4>
							</div>
							<div class=swiper-slide>
								<h4>Tab 3</h4>
							</div>-->
                </div>
                <!--<div class=swiper-pagination></div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import ws from "@/ws";
import moment from "moment";
import pluralize from "pluralize";
import request from "@/utils/request";

import PostsModal from "./PostsModal";
import MobileHeader from "@/components/header/Mobile";
import CalcCount from "./calcCount";
import BuildScale from "./buildScale";
import ClickOutside from "vue-click-outside";

import Footer from "@/components/footer/Index";
import MoneyTable from "./MoneyTable";
import User from "@/mixins/user";

import {
  chartTypes,
  periodTypes,
  getPeriodType,
  lineTypes,
  chartDataSets,
  periodTypeNames,
  getScaleData,
  dataProviderKeys
} from "./types";

import { chartOptions, altColor } from "./chartVars";

const colorSchemes = [
  "#FF5979",
  "#FF335A",
  "#FA493E",
  "#FF6726",
  "#1ECA77",
  "#00BF7C",
  "#30B5F2",
  "#0091F2",
  "#6A3DF2",
  "#47525A"
];

const matchChartCode = code => {
  const r = code.match(/(.*)_detailed_histogram_(.*)/);
  if (!r) {
    return false;
  }
  if (!lineTypes[r[1]]) {
    return false;
  }
  const periodI = periodTypeNames.indexOf(r[2]);
  if (periodI === -1) {
    return false;
  }
  return {
    chartType: lineTypes[r[1]].chartType,
    chartName: lineTypes[r[1]].chartType + "Chart",
    lineType: r[1],
    lineTitle: lineTypes[r[1]].title,
    periodType: periodTypes[periodI].name,
    dataProviderKey: lineTypes[r[1]].dataProviderKey,
    subKey: lineTypes[r[1]].countSubKey,
    countPostfix: lineTypes[r[1]].countPostfix
  };
};

const matchCodeByPrefix = (code, prefix) => {
  return code.match(new RegExp(`${prefix}_(.*)`));
};

const chartStorage = {};
Object.keys(chartTypes).forEach(chartType => {
  chartStorage[chartType] = {};
  for (let periodType of periodTypeNames) {
    chartStorage[chartType][periodType] = [];
  }
});

const topFollowersStorage = {};
for (let periodType of periodTypeNames) {
  topFollowersStorage[periodType] = {};
}

const barCount = 80;
const colorScheme = 1;
const mainColor = "#fff";

export default {
  name: "statistics-page",
  mixins: [CalcCount, BuildScale, User],
  directives: {
    ClickOutside
  },
  components: {
    PostsModal,
    MoneyTable,
    MobileHeader,
    Footer
  },
  data() {
    return {
      periodTypes,
      periodOptionsOpened: false,
      currentPeriodType: "daily",
      //
      showedStats: {},
      profileMapData: [],
      topFollowers: null,
      // tempDataSet: [],
      dataCache: {}, // by period
      subscribedWsCodes: [],
      //
      chartDataSets,
      updateDataTimeoutIds: {},
      updateChartTimeoutIds: {},
      moneyTableData: {},
      selectedLineChart: null,
      selectedLineName: null,
      balance: null,
      updateChartAttempts: {}
    };
  },
  mounted() {
    this.initCurrentPeriodType();
    this.initWs();
    this.buildScales();
    this.initLineCharts();
    this.fillLineChartsByEmptyPoints();
    this.initMapCharts();
  },
  beforeDestroy() {
    ws.removeListener("message", this.onData);
    ws.send({
      act: "clear_statistics"
    });
  },
  computed: {
    periodTitle() {
      const p = getPeriodType(this.currentPeriodType);
      if (!p.moment) {
        return "Today";
      }
      return (
        moment()
          .subtract(1, p.moment)
          .format("D MMMM") + " - Today"
      );
    }
  },
  methods: {
    initCurrentPeriodType() {
      const periodTypeNames = periodTypes.map(v => v.name);
      if (this.$route.params._currentPeriodType) {
        const type = this.$route.params._currentPeriodType;
        if (periodTypeNames.indexOf(type) !== -1) {
          this.currentPeriodType = type;
        }
      }
    },
    initWs() {
      if (!ws.connected) {
        ws.connect();
        ws.on("connect", () => {
          setTimeout(() => {
            this.sendWsRequests();
          }, 100);
        });
      } else {
        this.sendWsRequests();
      }
      ws.on("message", this.onData);
    },
    openPostsModal() {
      this.$store.dispatch("modal/show", { name: "statPosts" });
    },
    getPeriodType(name) {
      return getPeriodType(name);
    },
    selectPeriod(name) {
      this.currentPeriodType = name;
      this.periodOptionsOpened = false;
    },
    postsPeriodChange(period) {
      // this.buildScales();
      this.sendWsRequestsByPeriod(period);
      for (let v of chartStorage.posts[period]) {
        this.processData(v);
      }
    },
    subscribeUserStatistics(code, params) {
      if (this.subscribedWsCodes.indexOf(code) !== -1) {
        return;
      }
      let data = {
        act: "get_statistics",
        code: code
      };
      if ("undefined" !== typeof params) {
        data = Object.assign(data, params);
      }
      ws.send(data);
      this.subscribedWsCodes.push(code);
    },
    sendWsRequests() {
      this.sendWsRequestsByPeriod(this.currentPeriodType);

      // followers block
      // this.subscribeUserStatistics("current_subscribers_latest_now");
      // this.subscribeUserStatistics("user_subscribe_count_weekly");
      // this.subscribeUserStatistics("user_unsubscribe_count_weekly");
      //
      this.subscribeUserStatistics("view_profile_by_country_count_today");
      this.subscribeUserStatistics("view_profile_count_today");
      this.subscribeUserStatistics("view_profile_user_count_today");
      this.subscribeUserStatistics("view_profile_guest_count_today");
      this.subscribeUserStatistics("view_profile_count_weekly");
      this.subscribeUserStatistics("view_profile_count_all");
      this.subscribeUserStatistics("view_profile_by_device_count_today");
      //
      // this.subscribeUserStatistics("current_user_total_balance_info");
      // this.subscribeUserStatistics("paid_subscriptions_histogram_all");
      // this.subscribeUserStatistics("tips_histogram_all");
      // this.subscribeUserStatistics("paid_chat_messages_histogram_all");
      // this.subscribeUserStatistics("earn_referral_histogram_all");
    },
    sendWsRequestsByPeriod(period) {
      this.subscribeUserStatistics("new_post_detailed_histogram_" + period);
      this.subscribeUserStatistics("view_post_detailed_histogram_" + period);
      this.subscribeUserStatistics(
        "post_comment_added_detailed_histogram_" + period
      );
      this.subscribeUserStatistics("post_like_detailed_histogram_" + period);
      //
      this.subscribeUserStatistics("story_added_detailed_histogram_" + period);
      this.subscribeUserStatistics("story_view_detailed_histogram_" + period);
      //
      this.subscribeUserStatistics(
        "paid_subscriptions_detailed_histogram_" + period
      );
      this.subscribeUserStatistics("tips_detailed_histogram_" + period);
      this.subscribeUserStatistics(
        "paid_chat_messages_detailed_histogram_" + period
      );
      this.subscribeUserStatistics(
        "earn_referral_detailed_histogram_" + period
      );
      //

      this.subscribeUserStatistics(
        "current_followers_detailed_histogram_" + period
      );
      this.subscribeUserStatistics(
        "current_subscribers_detailed_histogram_" + period
      );

      this.subscribeUserStatistics("top_followers_count_" + period);
    },
    setCounter(ref, title, value, postfix) {
      if (title) {
        title = pluralize(title, value) + " ";
      } else {
        title = "&nbsp;";
      }
      if (!this.$refs[ref]) {
        console.log(ref + " not found");
        return;
      }
      if (!postfix) {
        postfix = "";
      }
      this.$refs[ref].innerHTML =
        "<div class='tab-stat__name'>" +
        title +
        "</div>" +
        "<span>" +
        postfix +
        value +
        "</span>";
    },
    updateChart(chart, statData, dataProviderKey, statDataSubKey) {
      if (!this.updateChartAttempts[dataProviderKey]) {
        this.updateChartAttempts[dataProviderKey] = 0;
      }
      if (this.updateChartAttempts[dataProviderKey] > 5) {
        return;
      }
      if (!chart.div) {
        setTimeout(() => {
          this.updateChartAttempts[dataProviderKey]++;
          this.updateChart(chart, statData, dataProviderKey, statDataSubKey);
        }, 1000);
      } else {
        this._updateChart(chart, statData, dataProviderKey, statDataSubKey);
      }
    },
    _updateChart(chart, statData, dataProviderKey, statDataSubKey) {
      const chartId = chart.div.id;
      const dataId = chart.div.id + "-" + dataProviderKey;

      if (this.updateDataTimeoutIds[dataId]) {
        clearTimeout(this.updateDataTimeoutIds[dataId]);
      }

      this.updateDataTimeoutIds[dataId] = setTimeout(() => {
        this.chartDataSets[chartId][dataProviderKey] = {};
        this.chartDataSets[chartId][dataProviderKey].statData = statData;
        this.chartDataSets[chartId][dataProviderKey].statDataSubKey =
          statDataSubKey || null;

        if (chartId === "earnings_chart") {
          // change data for earnings table block
          this.moneyTableData = { ...this.chartDataSets[chartId] };
        }

        this._updateChartDataProvider(
          chart,
          statData,
          dataProviderKey,
          statDataSubKey || null
        );
      }, 1000);

      // updating chart
      if (this.updateChartTimeoutIds[chartId]) {
        clearTimeout(this.updateChartTimeoutIds[chartId]);
      }
      this.updateChartTimeoutIds[chartId] = setTimeout(() => {
        chart.validateData();
      }, 1000);
    },
    _updateChartDataProvider(chart, statData, dataProviderKey, statDataSubKey) {
      const approx = {};
      for (let index of Object.keys(statData)) {
        let currIndex = 0;
        let diff = 0;
        for (let j = 0; j < barCount; j++) {
          let momentDiff = Math.abs(chart.dataProvider[j].date - index);
          if (0 === j || diff > momentDiff) {
            diff = momentDiff;
            currIndex = j;
          }
        }
        let val =
          "undefined" !== typeof approx[currIndex]
            ? parseInt(approx[currIndex], 10)
            : 0;
        let v;
        if (statDataSubKey) {
          v = statData[index][statDataSubKey];
        } else {
          v = statData[index];
        }
        approx[currIndex] = val + v;
      }
      for (let i in approx) {
        chart.dataProvider[i][dataProviderKey] = approx[i];
      }
    },
    onData(data) {
      if (data.financeChanged) {
        this.$refs.moneyTable.fetchFinance();
        return;
      }
      if (!data.statistics) {
        return;
      }
      if (
        "undefined" !== typeof this.showedStats[data.statistics.code] &&
        this.showedStats[data.statistics.code] > data.statistics.time
      ) {
        return;
      }

      // this.tempDataSet.push(data);

      if (this.$store.state.modal.statPosts.show) {
        this.$refs.postsModal.$refs.posts.processData(data);
      }

      this.processData(data, true);
    },
    shiftTimeZone(statistics) {
      const data = {};
      Object.keys(statistics.data).forEach(time => {
        const newTime = moment
          .unix(time)
          .local()
          .unix();
        data[newTime] = statistics.data[time];
      });
      const time = moment
        .unix(statistics.time)
        .local()
        .unix();
      return {
        code: statistics.code,
        data,
        time
      };
    },
    processData(data, store) {
      this.showedStats[data.statistics.code] = data.statistics.time;

      const statData =
        "NaN" === data.statistics.data ? 0 : data.statistics.data;

      let r = matchChartCode(data.statistics.code);
      if (r) {
        if (r.periodType !== this.currentPeriodType) {
          return;
        }
        data.statistics = this.shiftTimeZone(data.statistics);
        this.setCounter(
          "count_" + r.chartType + "_" + r.lineType,
          r.lineTitle,
          this.calcCount(statData, r.subKey || undefined),
          r.countPostfix
        );

        this.updateChart(
          this[r.chartName],
          statData,
          r.dataProviderKey,
          r.subKey || undefined,
          data.statistics.code
        );
        if (store) {
          chartStorage[r.chartType][r.periodType].push(data);
        }
        return;
      }

      r = matchCodeByPrefix(data.statistics.code, "top_followers_count");
      if (r) {
        this.updateTopFollowers(statData);
        topFollowersStorage[this.currentPeriodType] = statData;
        return;
      }

      switch (data.statistics.code) {
        // visitors
        case "view_profile_count_today":
          this.updateProfileDonut2(
            this.visitorsCountDonut,
            statData,
            "visitorsToday",
            "#FF335A"
          );
          break;
        case "view_profile_count_weekly":
          this.updateProfileDonut3(
            this.visitorsCountDonut,
            statData,
            "visitorsWeek",
            "#FF335A"
          );
          break;
        case "view_profile_count_all":
          this.updateProfileDonut3(
            this.visitorsCountDonut,
            statData,
            "visitorsTotal",
            "#FF335A",
            true
          );
          break;

        // users/guests
        case "view_profile_user_count_today":
          this.updateProfileDonut2(
            this.visitorsUsersCountDonut,
            statData,
            "visitorsUsers",
            "#ff9501"
          );
          break;
        case "view_profile_guest_count_weekly":
          this.updateProfileDonut3(
            this.visitorsUsersCountDonut,
            statData,
            "visitorsGuests",
            "#ff9501"
          );
          break;

        case "view_profile_by_device_count_today":
          this.updateProfileDeviceDonut(this.visitorsPlatformDonut, statData);
          break;

        case "view_profile_by_country_count_today":
          this.updateMap(statData);
          break;
      }
    },
    buildScales() {
      const now = moment()
        .utc()
        .unix();

      Object.keys(chartTypes).forEach(chartType => {
        this.buildScale(
          document.getElementById(chartType + "_scale"),
          this.currentPeriodType,
          now
        );
      });
    },
    initLineCharts() {
      this.buildChart("followers");
      this.buildChart("posts");
      this.buildChart("stories");
      this.earningsChart = window.AmCharts.makeChart("earnings_chart", {
        name: "earnings",
        type: "serial",
        categoryField: "date",
        fontFamily: "Open Sans",
        color: "#7c8b96",
        autoDisplay: false,
        autoMargins: false,
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        addClassNames: true,
        chartCursor: {
          cursorAlpha: 0.1,
          cursorColor: "#7C8B96",
          tabIndex: -1,
          valueLineAlpha: 0,
          zoomable: false,
          balloonPointerOrientation: "vertical",
          bulletsEnabled: true,
          bulletSize: 10,
          categoryBalloonEnabled: false,
          fullWidth: true,
          leaveAfterTouch: false,
          oneBalloonOnly: true
        },
        balloon: {
          animationDuration: 0,
          borderThickness: 0,
          fadeOutDuration: 0,
          fillAlpha: 1,
          fillColor: altColor,
          offsetX: 0,
          fontSize: 15,
          horizontalPadding: 8,
          verticalPadding: 3,
          shadowAlpha: 0
        },
        categoryAxis: {
          autoGridCount: false,
          labelsEnabled: false,
          axisThickness: 0,
          axisAlpha: 0.1,
          gridAlpha: 0,
          gridColor: "#7c8b96",
          startOnAxis: true,
          inside: true,
          tickLength: 2,
          offset: 1,
          gridThickness: 2,
          gridCount: barCount
        },
        valueAxes: [
          {
            labelsEnabled: false,
            axisThickness: 0,
            dashLength: 6,
            tickLength: 0,
            gridAlpha: 0.1,
            stackType: "regular",
            gridColor: "#7c8b96",
            zeroGridAlpha: 0,
            autoGridCount: false,
            gridCount: 4
          }
        ],
        graphs: [
          {
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            animationPlayed: true,
            fillColors: ["#3abfd3", "#49eeca"],
            type: "column",
            valueField: "earn_referral",
            fillAlphas: 1,
            lineAlpha: 0,
            fixedColumnWidth: 2,
            cornerRadiusTop: 1,
            balloon: {
              color: "#3abfd3"
            }
          },
          {
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            animationPlayed: true,
            fillColors: ["#67cc2e", "#b3f43a"],
            type: "column",
            valueField: "paid_chat_messages",
            fillAlphas: 1,
            lineAlpha: 0,
            fixedColumnWidth: 2,
            cornerRadiusTop: 1,
            balloon: {
              color: "#67cc2e"
            }
          },
          {
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            animationPlayed: true,
            fillColors: ["#ff9500", "#ffcc00"],
            type: "column",
            valueField: "tips",
            fillAlphas: 1,
            lineAlpha: 0,
            fixedColumnWidth: 2,
            cornerRadiusTop: 1,
            balloon: {
              color: "#ff9500"
            }
          },
          {
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            animationPlayed: true,
            fillColors: ["#FF3E33", "#FE3F8C"],
            type: "column",
            valueField: "paid_subscriptions",
            fillAlphas: 1,
            lineAlpha: 0,
            fixedColumnWidth: 2,
            cornerRadiusTop: 1,
            balloon: {
              color: "#FF3E33"
            }
          }
        ],
        dataProvider: []
      });
    },
    fillLineChartsByEmptyPoints() {
      this.followersChart.dataProvider = [];
      this.postsChart.dataProvider = [];
      this.storiesChart.dataProvider = [];
      this.earningsChart.dataProvider = [];

      const { periodType, count, startDate } = getScaleData(
        this.currentPeriodType
      );

      for (let i = barCount; i >= 1; i--) {
        let currDate = moment
          .unix(startDate)
          .subtract((i * count) / barCount, periodType)
          .unix();
        this.followersChart.dataProvider.push({
          date: currDate,
          followers: 0,
          subscribers: 0
        });
        this.postsChart.dataProvider.push({
          date: currDate,
          posts: 0,
          views: 0,
          likes: 0,
          comments: 0
        });
        this.storiesChart.dataProvider.push({
          date: currDate,
          uploads: 0,
          views: 0
        });
        this.earningsChart.dataProvider.push({
          date: currDate,
          paid_subscriptions: 0,
          tips: 0,
          paid_chat_messages: 0,
          earn_referral: 0
        });
      }
    },
    fillLineChartByEmptyPoints(name) {
      this[name + "Chart"].dataProvider = [];
      const { periodType, count, startDate } = getScaleData(
        this.currentPeriodType
      );
      const keys = {};
      dataProviderKeys[name].forEach(k => (keys[k] = 0));
      for (let i = barCount; i >= 1; i--) {
        let currDate = moment
          .unix(startDate)
          .subtract((i * count) / barCount, periodType)
          .unix();

        this[name + "Chart"].dataProvider.push(
          Object.assign(
            {
              date: currDate
            },
            keys
          )
        );
      }
    },
    initMapCharts() {
      this.visitorsCountDonut = window.AmCharts.makeChart("visitors_donut", {
        type: "pie",
        valueField: "value",
        radius: "50%",
        innerRadius: "66%",
        pullOutRadius: "0%",
        startDuration: 0,
        pullOutDuration: 0,
        balloonText: "",
        labelsEnabled: false,
        colorField: "color",
        outlineAlpha: 1,
        outlineThickness: "0",
        outlineColor: mainColor,
        alpha: 0.2,
        dataProvider: [
          {
            value: 1,
            color: "#7c8b96"
          }
        ]
      });
      this.visitorsUsersCountDonut = window.AmCharts.makeChart(
        "visitors_users_donut",
        {
          type: "pie",
          valueField: "value",
          radius: "50%",
          innerRadius: "66%",
          pullOutRadius: "0%",
          startDuration: 0,
          pullOutDuration: 0,
          balloonText: "",
          labelsEnabled: false,
          colorField: "color",
          outlineAlpha: 1,
          outlineThickness: "0",
          outlineColor: mainColor,
          alpha: 0.2,
          dataProvider: [
            {
              value: 1,
              color: "#7c8b96"
            }
          ]
        }
      );
      this.visitorsPlatformDonut = window.AmCharts.makeChart(
        "visitors_platform_donut",
        {
          type: "pie",
          valueField: "value",
          radius: "50%",
          innerRadius: "66%",
          pullOutRadius: "0%",
          startDuration: 0,
          pullOutDuration: 0,
          balloonText: "",
          labelsEnabled: false,
          colorField: "color",
          outlineAlpha: 1,
          outlineThickness: "0",
          outlineColor: mainColor,
          alpha: 0.2,
          dataProvider: [
            {
              value: 1,
              color: "#7c8b96"
            }
          ]
        }
      );
      this.mapChart = window.AmCharts.makeChart("visitors_map", {
        type: "map",
        fontFamily: "arial, sans-serif",
        dragMap: false,
        projection: "eckert3",
        zoomOnDoubleClick: false,
        balloon: {
          animationDuration: 0,
          borderThickness: 0,
          fadeOutDuration: 0,
          fillAlpha: 1,
          fillColor: altColor,
          offsetX: 0,
          fontSize: 15,
          horizontalPadding: 8,
          verticalPadding: 3,
          shadowAlpha: 0,
          color: mainColor,
          offsetY: 10
        },
        zoomControl: {
          panControlEnabled: false,
          zoomControlEnabled: false,
          homeButtonEnabled: false
        },
        areasSettings: {
          unlistedAreasColor: "#7c8b96",
          unlistedAreasAlpha: "0.3",
          unlistedAreasOutlineColor: mainColor,
          outlineColor: mainColor,
          outlineThickness: "0.5",
          rollOverOutlineColor: mainColor,
          color: "#7c8b96",
          colorSolid: colorSchemes[colorScheme]
        },
        dataProvider: {
          map: "worldLow",
          areas: []
        }
      });
    },
    getLineChartGraph({
      valueField,
      lineColor,
      fillColor,
      balloonColor,
      color
    }) {
      if (color) {
        lineColor = color;
        fillColor = color;
        balloonColor = color;
      }
      return {
        bulletSize: 0,
        bullet: "round",
        bulletBorderThickness: 0,
        minBulletSize: 0,
        animationPlayed: true,
        fillAlphas: 0.1,
        lineColor,
        type: "smoothedLine",
        fillColors: [fillColor, mainColor],
        valueField,
        lineThickness: 1.5,
        balloon: {
          color: balloonColor
        }
      };
    },
    getLinesChartGraph(lines, { selectedLineName }) {
      let _lines = lines.map(line => this.getLineChartGraph(line));
      if (selectedLineName) {
        let selectedLine = _lines.find(
          line => line.valueField === selectedLineName
        );
        // Make selected line more thick
        selectedLine.lineThickness = 2;
        selectedLine.fillAlphas = 0.9;
        // Set line to the end of array to show under others
        _lines = _lines.filter(line => line.valueField !== selectedLineName);
        _lines.push(selectedLine);
        return _lines;
      }
      return _lines;
    },
    updateMap(statData) {
      const sortable = [];
      for (let index in statData) {
        if (statData.hasOwnProperty(index)) {
          sortable.push([index, statData[index]]);
        }
      }
      sortable.sort((a, b) => {
        return b[1] - a[1];
      });
      if (sortable.length) {
        let alpha = sortable[0][1];
        sortable.forEach((item, i) => {
          this.profileMapData[i] = {
            id: item[0],
            alpha: 0.3 + (item[1] * 0.7) / alpha,
            value: item[1]
          };
        });
      }
      if (this.profileMapData.length) {
        this.mapChart.dataProvider.areas = this.profileMapData;
        this.mapChart.validateData();
      }
    },
    updateProfileDonut2(donut, statData, refKey, color) {
      if (!statData) {
        return;
      }
      if ("#7c8b96" === donut.dataProvider[0].color) {
        donut.dataProvider = [];
        donut.outlineThickness = "1.5";
        donut.alpha = 1;
      }
      donut.dataProvider[0] = {
        value: statData,
        color: color
      };
      donut.validateData();
      this.$refs[refKey].innerHTML = statData;
    },
    updateProfileDonut3(donut, statData, refKey, color, hasThird) {
      if (!statData) {
        return;
      }
      if ("#7c8b96" === donut.dataProvider[0].color) {
        donut.dataProvider = [];
        donut.outlineThickness = "1.5";
        donut.alpha = 1;
      }
      if ("undefined" === typeof donut.dataProvider[0]) {
        donut.dataProvider[0] = {
          value: 0,
          color: color
        };
      }
      if (hasThird) {
        if ("undefined" === typeof donut.dataProvider[1]) {
          donut.dataProvider[1] = {
            value: statData,
            color: "#3dbdd6"
          };
        }
        donut.dataProvider[2] = {
          value: statData,
          color: "#67cc2e"
        };
      } else {
        donut.dataProvider[1] = {
          value: statData,
          color: "#3bbdd3"
        };
      }
      donut.validateData();
      this.$refs[refKey].innerHTML = statData;
    },
    updateProfileDeviceDonut(donut, statData) {
      if ("undefined" !== typeof statData.mobile) {
        if ("#7c8b96" === donut.dataProvider[0].color) {
          donut.dataProvider = [];
          donut.outlineThickness = "1.5";
          donut.alpha = 1;
        }
        donut.dataProvider[0] = {
          value: statData.mobile,
          color: "#FF335A"
        };

        this.$refs.visitorsMobile.innerHTML = statData.mobile;
      }
      if ("undefined" !== typeof statData.desktop) {
        if ("#7c8b96" === donut.dataProvider[0].color) {
          donut.dataProvider = [];
          donut.outlineThickness = "1.5";
          donut.alpha = 1;
        }
        if ("undefined" === typeof donut.dataProvider[0]) {
          donut.dataProvider[0] = {
            value: 0,
            color: "#FF335A"
          };
        }
        donut.dataProvider[1] = {
          value: statData.desktop,
          color: "#67cc2e"
        };
        this.$refs.visitorsDesktop.innerHTML = statData.desktop;
      }
      donut.validateData();
    },
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
    updateTotalBalance(data) {
      if (!data || !data[0]) {
        this.balance = {
          data_current_balance: 0,
          data_overall_payouts: 0
        };
        return;
      }
      this.balance = data[0].message;
    },
    selectLine(name) {
      const m = name.match(/(.*)-(.*)/);
      this.selectedLineChart = m[1];
      this.selectedLineName = m[2];
      this.rebuildChart(this.selectedLineChart);
    },
    rebuildChart(name) {
      this[name + "Chart"].clear();
      this.buildChart(name);
      this.buildChartPointsFromCache(name);
    },
    buildChart(name) {
      let selectedLineName = null;
      if (name === this.selectedLineChart) {
        selectedLineName = this.selectedLineName;
      }

      switch (name) {
        case "followers":
          this.followersChart = window.AmCharts.makeChart(
            "followers_chart",
            JSON.parse(
              JSON.stringify({
                ...chartOptions,
                ...{
                  color: "#аа00",
                  graphs: this.getLinesChartGraph(
                    [
                      {
                        valueField: "followers",
                        color: "#FF335A"
                      },
                      {
                        valueField: "subscribers",
                        color: "#ff9500"
                      }
                    ],
                    {
                      selectedLineName
                    }
                  )
                }
              })
            )
          );
          break;

        case "posts":
          this.postsChart = window.AmCharts.makeChart(
            "posts_chart",
            JSON.parse(
              JSON.stringify({
                ...chartOptions,
                ...{
                  color: "#аа00",
                  graphs: this.getLinesChartGraph(
                    [
                      {
                        valueField: "posts",
                        color: "#FF335A"
                      },
                      {
                        valueField: "views",
                        color: "#ff9500"
                      },
                      {
                        valueField: "likes",
                        color: "#67cc2e"
                      },
                      {
                        valueField: "comments",
                        color: "#3abfd3"
                      }
                    ],
                    {
                      selectedLineName
                    }
                  )
                }
              })
            )
          );
          break;

        case "stories":
          this.storiesChart = window.AmCharts.makeChart(
            "stories_chart",
            JSON.parse(
              JSON.stringify({
                ...chartOptions,
                ...{
                  color: "#7c8b96",
                  graphs: this.getLinesChartGraph(
                    [
                      {
                        valueField: "uploads",
                        color: "#FF335A"
                      },
                      {
                        valueField: "views",
                        color: "#ff9500"
                      }
                    ],
                    {
                      selectedLineName
                    }
                  )
                }
              })
            )
          );
          break;
      }
    },
    buildChartPointsFromCache(name) {
      this.fillLineChartByEmptyPoints(name);
      for (let v of chartStorage[name][this.currentPeriodType]) {
        this.processData(v, false);
      }
      this[name + "Chart"].validateData();
    },
    updateTopFollowersFromCache() {
      this.topFollowers = [];
      this.updateTopFollowers(topFollowersStorage[this.currentPeriodType]);
    }
  },
  watch: {
    currentPeriodType() {
      this.buildScales();
      this.fillLineChartsByEmptyPoints();
      this.sendWsRequestsByPeriod(this.currentPeriodType);
      Object.keys(chartTypes).forEach(chartType => {
        for (let v of chartStorage[chartType][this.currentPeriodType]) {
          this.processData(v, false);
        }
        this[chartType + "Chart"].validateData();
      });
      this.updateTopFollowersFromCache();
      if (this.$route.path !== "/statistics/" + this.currentPeriodType) {
        this.$router.push("/statistics/" + this.currentPeriodType);
      }
    }
  }
};
</script>
