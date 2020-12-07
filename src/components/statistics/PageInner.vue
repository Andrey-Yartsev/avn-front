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
                    <div class="no-items" v-else>
                      No followers for current period
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
import { getUnixTime, sub, format } from "date-fns";
import pluralize from "pluralize";
import ClickOutside from "vue-click-outside";

import PostsModal from "./PostsModal";
import MobileHeader from "@/components/header/Mobile";
import CalcCountMixin from "@/components/statistics/mixins/calcCount";
import ChartDonutBuildingMixin from "@/components/statistics/mixins/chartDonutBuilding";
import BuildScaleMixin from "@/components/statistics/mixins/buildScale";
import ChartBuildingMixin from "@/components/statistics/mixins/chartBuilding";
import ChartDataMixin from "@/components/statistics/mixins/chartData";

import Footer from "@/components/footer/Index";
import MoneyTable from "./MoneyTable";
import UserMixin from "@/mixins/user";

import {
  chartTypes,
  periodTypes,
  getPeriodType,
  chartDataSets,
  periodTypeNames
} from "@/components/statistics/utils/common";

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

export default {
  name: "statistics-page",
  mixins: [
    UserMixin,
    CalcCountMixin,
    BuildScaleMixin,
    ChartBuildingMixin,
    ChartDonutBuildingMixin,
    ChartDataMixin
  ],
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
      currentPeriodType: "monthly",
      //
      showedStats: {},
      profileMapData: [],
      topFollowers: null,
      // tempDataSet: [],
      dataCache: {}, // by period
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
    this.initDonutCharts();
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
        format(
          sub(new Date(), {
            [p.moment]: 1
          }),
          "d MMMM"
        ) + " - Today"
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
    buildScales() {
      const now = getUnixTime(new Date());

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
      this.buildChart("earnings");
    },
    fillLineChartsByEmptyPoints() {
      this.fillLineChartByEmptyPoints("followers");
      this.fillLineChartByEmptyPoints("posts");
      this.fillLineChartByEmptyPoints("stories");
      this.fillLineChartByEmptyPoints("earnings");
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
      if (this.$route.path !== "/statistics/" + this.currentPeriodType) {
        this.$router.push("/statistics/" + this.currentPeriodType);
      }
    }
  }
};
</script>
