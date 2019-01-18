<template>
  <div class="boxes">
    <PostsModal :data="tempDataQueue" />

    <div class="cols">
      <!--
      <div class="col col-1-3">
        <div class="box" id="followers-box">
          <h3 class="box-title">
            Followers
            <span class="chart_period"><span ref="chartPeriod1"></span> - Today</span>
          </h3>
          <div class="charts-wrapper-outer">
            <div class="charts-data" id="charts-data-followers">
              <span class="followers" ref="chartsDataFollowersFollowers">Followers	<span>0</span></span>
              <span class="subscribed" ref="chartsDataFollowersSubscribed">&nbsp;<span>0</span></span>
              <span class="unsubscribed" ref="chartsDataFollowersUnsubscribed">&nbsp;<span>0</span></span>
            </div>
            <div id="followers_charts" class="charts-wrapper charts-wrapper_followers"></div>
            <div id="subscribed_charts" class="charts-wrapper charts-wrapper_subscribed"></div>
            <div class="statistics-chart-scale"></div>
          </div>
        </div>
      </div>
      -->
      <div class="col col-1-2">
        <div class="box" id="posts-box">
          <h3 class="box-title">
            Posts
            <span class="chart_period"><span ref="chartPeriod2"></span> - Today</span>
          </h3>
          <div class="charts-wrapper-outer">
            <div class="charts-data">
              <span class="posts" ref="chartsDataPostsPosts">Posts <span>0</span></span>
              <span class="views" ref="chartsDataPostsViews">Views <span>0</span></span>
              <span class="likes" ref="chartsDataPostsLikes">Likes <span>0</span></span>
              <span class="comments" ref="chartsDataPostsComments">Comments	<span>0</span></span>
            </div>
            <div id="posts_charts" class="charts-wrapper charts-wrapper_posts"></div>
            <div class="statistics-chart-scale"></div>
          </div>
        </div>
      </div>
      <div class="col col-1-2">
        <div class="box" id="stories-box">
          <h3 class="box-title">
            Stories
            <span class="chart_period"><span ref="chartPeriod3"></span> - Today</span>
          </h3>
          <div class=charts-wrapper-outer>
            <div class=charts-data>
              <span class=uploaded ref="chartsDataStoriesUploaded">Uploaded<span>0</span></span>
              <span class=views ref="chartsDataStoriesViews">Views<span>0</span></span>
              <!--<span class=comments ref="chartsDataStoriesComments">Comments<span>0</span></span>-->
            </div>
            <div id="stories_charts" class="charts-wrapper charts-wrapper_stories"></div>
            <div class="statistics-chart-scale"></div>
          </div>
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
                  <div class="visitors_today">Today <span ref="visitorsToday">0</span></div>
                  <div class="visitors_week">Week <span ref="visitorsWeek">0</span></div>
                  <div class="visitors_total">Total <span ref="visitorsTotal">0</span></div>
                </div>
              </div>
              <div class="visitors-donuts-wrapper">
                <div id="visitors_users_donut"></div>
                <div class="visitors_data">
                  <div class="visitors_users">Followers <span ref="visitorsUsers">0</span></div>
                  <div class="visitors_guests">Guests <span ref="visitorsGuests">0</span></div>
                </div>
              </div>
              <div class="visitors-donuts-wrapper">
                <div id="visitors_platform_donut"></div>
                <div class="visitors_data">
                  <div class="visitors_mobile">Mobile <span ref="visitorsMobile">0</span></div>
                  <div class="visitors_desktop">Desktop <span ref="visitorsDesktop">0</span></div>
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
                      <span class="avatar avatar_gap-r-sm avatar_sm">
                        <span class="avatar__img">
                          <img :src="v.avatar" v-if="v.avatar" />
                        </span>
                      </span>
                      <div class="username-group">
                        <div class="user__name">
                          <div class="name">{{ v.name }}</div>
                        </div>
                        <span class="user-login">{{ v.username }}</span>
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
</template>

<script>
import ws from "@/ws";
import moment from "moment";
import pluralize from "pluralize";
import request from "@/utils/request";

import PostsModal from "./PostsModal";

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

const barCount = 80;
const colorScheme = 1;
const mainColor = "#fff";
const altColor = "#16181A";

export default {
  name: "app",
  components: {
    PostsModal
  },
  data() {
    return {
      showedStats: {},
      profileMapData: [],
      topFollowers: null,
      tempDataQueue: []
    };
  },
  created() {
    if (!ws.connected) {
      ws.connect();
      ws.on("connect", () => {
        this.sendWsRequests();
      });
    } else {
      this.sendWsRequests();
    }
    ws.on("message", this.onData);
  },
  beforeDestroy() {
    ws.removeListener("message", this.onData);
  },
  methods: {
    getUserStatistics(code, params) {
      let data = {
        act: "get_statistics",
        code: code
      };
      if ("undefined" !== typeof params) {
        data = Object.assign(data, params);
      }
      ws.send(data);
    },
    sendWsRequests() {
      // followers block
      this.getUserStatistics("current_subscribers_latest_now");
      this.getUserStatistics("user_subscribe_count_last_week");
      this.getUserStatistics("user_unsubscribe_count_last_week");
      //
      this.getUserStatistics("new_post_count_last_week");
      this.getUserStatistics("view_post_count_last_week");
      this.getUserStatistics("post_like_count_last_week");
      this.getUserStatistics("post_comment_added_count_last_week");
      //
      this.getUserStatistics("new_post_detailed_histogram_last_week");
      this.getUserStatistics("view_post_detailed_histogram_last_week");
      this.getUserStatistics("post_comment_added_detailed_histogram_last_week");
      this.getUserStatistics("post_like_detailed_histogram_last_week");
      //
      this.getUserStatistics("story_added_count_last_week");
      this.getUserStatistics("story_view_count_last_week");
      this.getUserStatistics("story_comment_added_count_last_week");
      this.getUserStatistics("story_added_detailed_histogram_last_week");
      this.getUserStatistics("story_view_detailed_histogram_last_week");
      this.getUserStatistics("story_comment_detailed_histogram_last_week");
      //
      this.getUserStatistics("view_profile_by_country_count_today");
      this.getUserStatistics("view_profile_count_today");
      this.getUserStatistics("view_profile_user_count_today");
      this.getUserStatistics("view_profile_guest_count_today");
      this.getUserStatistics("view_profile_count_last_week");
      this.getUserStatistics("view_profile_count_all");
      this.getUserStatistics("view_profile_by_device_count_today");
      //
      this.getUserStatistics("top_followers_count_today");
    },
    setCounter(ref, title, value) {
      if (title) {
        title = pluralize(title, value) + " ";
      } else {
        title = "&nbsp;";
      }
      this.$refs[ref].innerHTML = title + "<span>" + value + "</span>";
    },
    updateChart(chart, statData, dataProviderKey, statDataSubKey) {
      const approx = {};
      for (let index in statData) {
        if (statData.hasOwnProperty(index)) {
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
      }
      for (let i in approx) {
        chart.dataProvider[i][dataProviderKey] = approx[i];
      }
      chart.validateData();
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
        var alpha = sortable[0][1];
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
    updateProfileDonut(donut, statData, refKey, color) {
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
    updateProfileDonutCount(donut, statData, refKey, color, hasThird) {
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
    updateProfileDeviceDonutCount(donut, statData) {
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
      if (!statData || !statData.length) {
        return;
      }
      const ids = statData.map(item => "ids[]=" + item.key_field);
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
    onData(data) {
      if (!data.statistics) {
        return;
      }
      if (
        "undefined" !== typeof this.showedStats[data.statistics.code] &&
        this.showedStats[data.statistics.code] > data.statistics.time
      ) {
        return;
      }

      this.tempDataQueue.push(data);

      this.showedStats[data.statistics.code] = data.statistics.time;
      const statData =
        "NaN" === data.statistics.data ? 0 : data.statistics.data;

      switch (data.statistics.code) {
        // case "current_subscribers_latest_now":
        //   this.setCounter(
        //     "chartsDataFollowersFollowers",
        //     "Followers",
        //     statData.length ? statData[0].message.data_count : 0
        //   );
        //   break;
        //
        // case "user_subscribe_count_last_week":
        //   this.setCounter("chartsDataFollowersSubscribed", false, statData);
        //   break;
        //
        // case "user_unsubscribe_count_last_week":
        //   this.setCounter("chartsDataFollowersUnsubscribed", false, statData);
        //   break;

        case "new_post_count_last_week":
          this.setCounter("chartsDataPostsPosts", "Post", statData);
          break;

        case "view_post_count_last_week":
          this.setCounter("chartsDataPostsViews", "View", statData);
          break;

        case "post_like_count_last_week":
          this.setCounter("chartsDataPostsLikes", "Like", statData);
          break;

        case "post_comment_added_count_last_week":
          this.setCounter("chartsDataPostsComments", "Comment", statData);
          break;

        case "story_added_count_last_week":
          this.setCounter("chartsDataStoriesUploaded", "Uploaded", statData);
          break;
        case "story_view_count_last_week":
          this.setCounter("chartsDataStoriesViews", "Views", statData);
          break;
        case "story_comment_count_last_week":
          // this.setCounter("chartsDataStoriesComments", "Comment", statData);
          break;

        case "new_post_detailed_histogram_last_week":
          this.updateChart(this.postsChart, statData, "posts");
          break;

        case "view_post_detailed_histogram_last_week":
          this.updateChart(this.postsChart, statData, "views");
          break;

        case "post_comment_added_detailed_histogram_last_week":
          this.updateChart(this.postsChart, statData, "comments");
          break;

        case "post_like_detailed_histogram_last_week":
          this.updateChart(this.postsChart, statData, "likes", "total");
          break;

        case "story_added_detailed_histogram_last_week":
          this.updateChart(this.storiesChart, statData, "uploads");
          break;

        case "story_view_detailed_histogram_last_week":
          this.updateChart(this.storiesChart, statData, "views");
          break;

        case "story_comment_added_detailed_histogram_last_week":
          this.updateChart(this.storiesChart, statData, "comments");
          break;

        // case 'story_view_count_last_week':
        //   // $('#charts-data-stories .views').html(pluralize('View', statData) + ' <span>' + statData + '</span>');
        //   break;
        //
        // case 'story_comment_added_count_last_week':
        //   // $('#charts-data-stories .comments').html(pluralize('Comment', statData) + ' <span>' + statData + '</span>');
        //   break;
        //
        // case 'paid_subscriptions_count_last_week':
        //   // $('#charts-data-earnings .paid_subscriptions span').html(statData);
        //   break;
        //
        // case 'tips_count_last_week':
        //   // $('#charts-data-earnings .tips span').html(statData);
        //   break;
        //
        // case 'paid_chat_messages_count_last_week':
        //   // $('#charts-data-earnings .paid_chat_messages span').html(statData);
        //   break;
        //
        // case 'earn_referral_count_last_week':
        //   // $('#charts-data-earnings .earn_referral span').html(statData);
        //   break;
        //
        // case "current_subscribers_latest_last_week":
        //   this.getUserStatistics("current_subscribers_list_last_week");
        //   var start_value = statData.length ? statData[0].message.data_count : 0;
        //   for (var i = 0; i < bar_count; i++) {
        //     this.followers_charts.dataProvider[i].followers = start_value;
        //   }
        //   break;
        // case 'current_subscribers_list_last_week':
        //   var approx_arr = {};
        //   for (var index in statData) {
        //     if (statData.hasOwnProperty(index)) {
        //       var timestamp = moment.utc(statData[index].message.timestamp).unix(),
        //         curr_index = 0,
        //         diff = 0;
        //       for (var ii = 0; ii < bar_count; ii++) {
        //         var moment_diff = Math.abs(this.followers_charts.dataProvider[ii].date - timestamp);
        //         if (0 === ii || diff > moment_diff) {
        //           diff = moment_diff;
        //           curr_index = ii;
        //         }
        //       }
        //       var val = 'undefined' !== typeof approx_arr[curr_index] ? parseInt(approx_arr[curr_index], 10) : 0;
        //       approx_arr[curr_index] = val + statData[index].message.data_count;
        //     }
        //   }
        //   for (var i in approx_arr) {
        //     for (var ii = i; ii < bar_count; ii++) {
        //       this.followers_charts.dataProvider[ii].followers = approx_arr[i];
        //     }
        //   }
        //   this.followers_charts.validateData();
        //   break;
        //
        // case 'user_subscribe_detailed_histogram_last_week':
        //   var approx_arr = {};
        //   for (var index in statData) {
        //     if (statData.hasOwnProperty(index)) {
        //       var curr_index = 0,
        //         diff = 0;
        //       for (var ii = 0; ii < bar_count; ii++) {
        //         var moment_diff = Math.abs(subscribed_charts.dataProvider[ii].date - index);
        //         if (0 === ii || diff > moment_diff) {
        //           diff = moment_diff;
        //           curr_index = ii;
        //         }
        //       }
        //       var val = 'undefined' !== typeof approx_arr[curr_index] ? parseInt(approx_arr[curr_index], 10) : 0;
        //       approx_arr[curr_index] = val + statData[index];
        //     }
        //   }
        //   for (var i in approx_arr) {
        //     subscribed_charts.dataProvider[i].subscribed = approx_arr[i];
        //   }
        //   subscribed_charts.validateData();
        //   break;
        //
        // case 'user_unsubscribe_detailed_histogram_last_week':
        //   var approx_arr = {};
        //   for (var index in statData) {
        //     if (statData.hasOwnProperty(index)) {
        //       var curr_index = 0,
        //         diff = 0;
        //       for (var ii = 0; ii < bar_count; ii++) {
        //         var moment_diff = Math.abs(subscribed_charts.dataProvider[ii].date - index);
        //         if (0 === ii || diff > moment_diff) {
        //           diff = moment_diff;
        //           curr_index = ii;
        //         }
        //       }
        //       var val = 'undefined' !== typeof approx_arr[curr_index] ? parseInt(approx_arr[curr_index], 10) : 0;
        //       approx_arr[curr_index] = val + statData[index];
        //     }
        //   }
        //   for (var i in approx_arr) {
        //     subscribed_charts.dataProvider[i].unsubscribed = -approx_arr[i];
        //   }
        //   subscribed_charts.validateData();
        //   break;
        //
        // case "paid_subscriptions_detailed_histogram_last_week":
        //   var approx_arr = {};
        //   for (var index in statData) {
        //     if (statData.hasOwnProperty(index)) {
        //       var curr_index = 0,
        //         diff = 0;
        //       for (var ii = 0; ii < bar_count; ii++) {
        //         var moment_diff = Math.abs(earnings_charts.dataProvider[ii].date - index);
        //         if (0 === ii || diff > moment_diff) {
        //           diff = moment_diff;
        //           curr_index = ii;
        //         }
        //       }
        //       var val = "undefined" !== typeof approx_arr[curr_index] ? parseInt(approx_arr[curr_index], 10) : 0;
        //       approx_arr[curr_index] = val + statData[index].total;
        //     }
        //   }
        //   for (var i in approx_arr) {
        //     earnings_charts.dataProvider[i].paid_subscriptions = approx_arr[i];
        //   }
        //   earnings_charts.validateData();
        //   break;
        //
        // case "tips_detailed_histogram_last_week":
        //   var approx_arr = {};
        //   for (var index in statData) {
        //     if (statData.hasOwnProperty(index)) {
        //       var curr_index = 0,
        //         diff = 0;
        //       for (var ii = 0; ii < bar_count; ii++) {
        //         var moment_diff = Math.abs(earnings_charts.dataProvider[ii].date - index);
        //         if (0 === ii || diff > moment_diff) {
        //           diff = moment_diff;
        //           curr_index = ii;
        //         }
        //       }
        //       var val = "undefined" !== typeof approx_arr[curr_index] ? parseInt(approx_arr[curr_index], 10) : 0;
        //       approx_arr[curr_index] = val + statData[index].total;
        //     }
        //   }
        //   for (var i in approx_arr) {
        //     earnings_charts.dataProvider[i].tips = approx_arr[i];
        //   }
        //   earnings_charts.validateData();
        //   break;
        //
        // case "paid_chat_messages_detailed_histogram_last_week":
        //   var approx_arr = {};
        //   for (var index in statData) {
        //     if (statData.hasOwnProperty(index)) {
        //       var curr_index = 0,
        //         diff = 0;
        //       for (var ii = 0; ii < bar_count; ii++) {
        //         var moment_diff = Math.abs(earnings_charts.dataProvider[ii].date - index);
        //         if (0 === ii || diff > moment_diff) {
        //           diff = moment_diff;
        //           curr_index = ii;
        //         }
        //       }
        //       var val = "undefined" !== typeof approx_arr[curr_index] ? parseInt(approx_arr[curr_index], 10) : 0;
        //       approx_arr[curr_index] = val + statData[index].total;
        //     }
        //   }
        //   for (var i in approx_arr) {
        //     earnings_charts.dataProvider[i].paid_chat_messages = approx_arr[i];
        //   }
        //   earnings_charts.validateData();
        //   break;
        //
        // case "earn_referral_detailed_histogram_last_week":
        //   var approx_arr = {};
        //   for (var index in statData) {
        //     if (statData.hasOwnProperty(index)) {
        //       var curr_index = 0,
        //         diff = 0;
        //       for (var ii = 0; ii < bar_count; ii++) {
        //         var moment_diff = Math.abs(earnings_charts.dataProvider[ii].date - index);
        //         if (0 === ii || diff > moment_diff) {
        //           diff = moment_diff;
        //           curr_index = ii;
        //         }
        //       }
        //       var val = "undefined" !== typeof approx_arr[curr_index] ? parseInt(approx_arr[curr_index], 10) : 0;
        //       approx_arr[curr_index] = val + statData[index].total;
        //     }
        //   }
        //   for (var i in approx_arr) {
        //     earnings_charts.dataProvider[i].earn_referral = approx_arr[i];
        //   }
        //   earnings_charts.validateData();
        //   break;
        //

        case "view_profile_count_today":
          this.updateProfileDonut(
            this.visitorsCountDonut,
            statData,
            "visitorsToday",
            "#FF335A"
          );
          break;

        case "view_profile_user_count_today":
          this.updateProfileDonut(
            this.visitorsUsersCountDonut,
            statData,
            "visitorsUsers",
            "#ff9501"
          );
          break;

        case "view_profile_guest_count_today":
          this.updateProfileDonutCount(
            this.visitorsUsersCountDonut,
            statData,
            "visitorsGuests",
            "#ff9501"
          );
          break;

        case "view_profile_count_last_week":
          this.updateProfileDonutCount(
            this.visitorsUsersCountDonut,
            statData,
            "visitorsWeek",
            "#FF335A"
          );
          break;

        case "view_profile_count_all":
          this.updateProfileDonutCount(
            this.visitorsCountDonut,
            statData,
            "visitorsTotal",
            "#FF335A",
            true
          );
          break;

        case "view_profile_by_device_count_today":
          this.updateProfileDeviceDonutCount(
            this.visitorsPlatformDonut,
            statData
          );
          break;

        case "view_profile_by_country_count_today":
          this.updateMap(statData);
          break;

        case "top_followers_count_today":
          this.updateTopFollowers(statData);
          break;
      }

      // if (data.users_data) {
      //   let html = "";
      //   for (let i in data.users_data) {
      //     if (data.users_data.hasOwnProperty(i)) {
      //       html +=
      //         '<a class=followers-item href="https://' +
      //         data.users_data[i].username +
      //         "." +
      //         DOMAIN +
      //         '">';
      //       if (null === data.users_data[i].avatar) {
      //         html += "<span class=followers-avatar></span>";
      //       } else {
      //         html +=
      //           '<span class=followers-avatar style="background-image:url(' +
      //           POST_MEDIA_CONFIG.prefix +
      //           data.users_data[i].avatar +
      //           ')"></span>';
      //       }
      //       html +=
      //         "<span class=followers-name>" +
      //         data.users_data[i].name +
      //         "</span>";
      //       html +=
      //         "<span class=followers-username>@" +
      //         data.users_data[i].username +
      //         "</span></a>";
      //     }
      //   }
      //   this.$refs.followersList.innerHTML = html;
      // }
    },
    initLineCharts() {
      this.followers_charts = window.AmCharts.makeChart("followers_charts", {
        type: "serial",
        categoryField: "date",
        theme: "default",
        fontFamily: "Open Sans",
        color: "#7c8b96",
        autoDisplay: false,
        autoMargins: false,
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
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
          labelsEnabled: false,
          axisAlpha: 0,
          startOnAxis: true,
          gridAlpha: 0,
          tickLength: 0
        },
        valueAxes: [
          {
            labelsEnabled: false,
            axisThickness: 0,
            dashLength: 6,
            tickLength: 0,
            gridAlpha: 0.1,
            gridColor: "#7c8b96",
            zeroGridAlpha: 0,
            autoGridCount: false,
            gridCount: 2
          }
        ],
        graphs: [
          {
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            animationPlayed: true,
            fillAlphas: 0.1,
            type: "smoothedLine",
            lineColor: "#3abfd3",
            fillColors: ["#3abfd3", mainColor],
            valueField: "followers",
            lineThickness: 1.5,
            balloon: {
              color: "#3abfd3"
            }
          }
        ],
        dataProvider: []
      });
      this.postsChart = window.AmCharts.makeChart("posts_charts", {
        type: "serial",
        categoryField: "date",
        theme: "default",
        fontFamily: "Open Sans",
        color: "#аа00",
        autoDisplay: false,
        autoMargins: false,
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
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
          labelsEnabled: false,
          axisAlpha: 0,
          startOnAxis: true,
          gridAlpha: 0,
          tickLength: 0
        },
        valueAxes: [
          {
            labelsEnabled: false,
            axisThickness: 0,
            dashLength: 6,
            tickLength: 0,
            gridAlpha: 0.1,
            gridColor: "#7c8b96",
            zeroGridAlpha: 0.1,
            autoGridCount: false,
            gridCount: 5
          }
        ],
        graphs: [
          {
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            animationPlayed: true,
            fillAlphas: 0.1,
            lineColor: "#FF335A",
            type: "smoothedLine",
            fillColors: ["#FF335A", mainColor],
            valueField: "posts",
            lineThickness: 1.5,
            balloon: {
              color: "#FF335A"
            }
          },
          {
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            animationPlayed: true,
            fillAlphas: 0.1,
            lineColor: "#ff9500",
            fillColors: ["#ff9500", mainColor],
            type: "smoothedLine",
            valueField: "views",
            lineThickness: 1.5,
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
            fillAlphas: 0.1,
            lineColor: "#67cc2e",
            fillColors: ["#67cc2e", mainColor],
            type: "smoothedLine",
            valueField: "likes",
            lineThickness: 1.5,
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
            fillAlphas: 0.1,
            lineColor: "#3abfd3",
            fillColors: ["#3abfd3", mainColor],
            type: "smoothedLine",
            valueField: "comments",
            lineThickness: 1.5,
            balloon: {
              color: "#3abfd3"
            }
          }
        ],
        dataProvider: []
      });
      // var subscribed_charts = window.AmCharts.makeChart("subscribed_charts",
      //   {
      //     "type": "serial",
      //     "categoryField": "date",
      //     "theme": "default",
      //     "fontFamily": "Open Sans",
      //     "color": "#7c8b96",
      //     "autoDisplay": false,
      //     "autoMargins": false,
      //     "marginBottom": 0,
      //     "marginTop": 0,
      //     "marginLeft": 4,
      //     "marginRight": 4,
      //     "addClassNames": true,
      //     "chartCursor": {
      //       "cursorAlpha": 0.1,
      //       "cursorColor": "#7C8B96",
      //       "tabIndex": -1,
      //       "valueLineAlpha": 0,
      //       "zoomable": false,
      //       "balloonPointerOrientation": "vertical",
      //       "bulletsEnabled": true,
      //       "bulletSize": 10,
      //       "categoryBalloonEnabled": false,
      //       "fullWidth": true,
      //       "leaveAfterTouch": false,
      //       "oneBalloonOnly": true
      //     },
      //     "balloon": {
      //       "animationDuration": 0,
      //       "borderThickness": 0,
      //       "fadeOutDuration": 0,
      //       "fillAlpha": 1,
      //       "fillColor": alt_color,
      //       "offsetX": 0,
      //       "fontSize": 15,
      //       "horizontalPadding": 8,
      //       "verticalPadding": 3,
      //       "shadowAlpha": 0
      //     },
      //     "categoryAxis": {
      //       "autoGridCount": false,
      //       "labelsEnabled": false,
      //       "axisThickness": 0,
      //       "axisAlpha": 0.1,
      //       "gridAlpha": 0,
      //       "gridColor": "#7c8b96",
      //       "startOnAxis": true,
      //       "inside": true,
      //       "tickLength": 2,
      //       "offset": 1,
      //       "gridThickness": 2,
      //       "gridCount": bar_count
      //     },
      //     "valueAxes": [
      //       {
      //         "labelsEnabled": false,
      //         "axisThickness": 0,
      //         "tickLength": 0,
      //         "gridAlpha": 0
      //       }
      //     ],
      //     "graphs": [
      //       {
      //         "bulletSize": 0,
      //         "bullet": "round",
      //         "bulletBorderThickness": 0,
      //         "minBulletSize": 0,
      //         "animationPlayed": true,
      //         "fillColors": ["#67cc2e", "#b3f43a"],
      //         "type": "column",
      //         "valueField": "subscribed",
      //         "fillAlphas": 1,
      //         "lineAlpha": 0,
      //         "fixedColumnWidth": 2,
      //         "clustered": false,
      //         "cornerRadiusTop": 1,
      //         "balloon": {
      //           "color": "#67cc2e"
      //         }
      //       }, {
      //         "bulletSize": 0,
      //         "bullet": "round",
      //         "bulletBorderThickness": 0,
      //         "minBulletSize": 0,
      //         "animationPlayed": true,
      //         "fillColors": ["#FF3E33", "#FE3F8C"],
      //         "type": "column",
      //         "valueField": "unsubscribed",
      //         "fillAlphas": 1,
      //         "lineAlpha": 0,
      //         "fixedColumnWidth": 2,
      //         "clustered": false,
      //         "cornerRadiusTop": 1,
      //         "balloon": {
      //           "color": "#FF3E33"
      //         }
      //       }
      //     ],
      //     "dataProvider": []
      //   }
      // );
      // const profile_map_data = [];
      this.storiesChart = window.AmCharts.makeChart("stories_charts", {
        type: "serial",
        categoryField: "date",
        theme: "default",
        fontFamily: "Open Sans",
        color: "#7c8b96",
        autoDisplay: false,
        autoMargins: false,
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
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
          labelsEnabled: false,
          axisAlpha: 0,
          startOnAxis: true,
          gridAlpha: 0,
          tickLength: 0
        },
        valueAxes: [
          {
            labelsEnabled: false,
            autoGridCount: false,
            gridCount: 5,
            axisThickness: 0,
            dashLength: 6,
            tickLength: 0,
            gridAlpha: 0.1,
            gridColor: "#7c8b96",
            zeroGridAlpha: 0.1
          }
        ],
        graphs: [
          {
            animationPlayed: true,
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            fillAlphas: 0.1,
            lineColor: "#FF335A",
            fillColors: ["#FF335A", mainColor],
            type: "smoothedLine",
            valueField: "uploads",
            lineThickness: 1.5,
            balloon: {
              color: "#FF335A"
            }
          },
          {
            animationPlayed: true,
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            fillAlphas: 0.1,
            lineColor: "#ff9500",
            fillColors: ["#ff9500", mainColor],
            type: "smoothedLine",
            valueField: "views",
            lineThickness: 1.5,
            balloon: {
              color: "#ff9500"
            }
          },
          {
            animationPlayed: true,
            bulletSize: 0,
            bullet: "round",
            bulletBorderThickness: 0,
            minBulletSize: 0,
            fillAlphas: 0.1,
            lineColor: "#3abfd3",
            fillColors: ["#3abfd3", mainColor],
            type: "smoothedLine",
            valueField: "comments",
            lineThickness: 1.5,
            balloon: {
              color: "#3abfd3"
            }
          }
        ],
        dataProvider: []
      });
      //   earnings_charts = window.AmCharts.makeChart("earnings_charts",
      //     {
      //       "type": "serial",
      //       "categoryField": "date",
      //       "fontFamily": "Open Sans",
      //       "color": "#7c8b96",
      //       "autoDisplay": false,
      //       "autoMargins": false,
      //       "marginBottom": 0,
      //       "marginTop": 0,
      //       "marginLeft": 0,
      //       "marginRight": 0,
      //       "addClassNames": true,
      //       "chartCursor": {
      //         "cursorAlpha": 0.1,
      //         "cursorColor": "#7C8B96",
      //         "tabIndex": -1,
      //         "valueLineAlpha": 0,
      //         "zoomable": false,
      //         "balloonPointerOrientation": "vertical",
      //         "bulletsEnabled": true,
      //         "bulletSize": 10,
      //         "categoryBalloonEnabled": false,
      //         "fullWidth": true,
      //         "leaveAfterTouch": false,
      //         "oneBalloonOnly": true
      //       },
      //       "balloon": {
      //         "animationDuration": 0,
      //         "borderThickness": 0,
      //         "fadeOutDuration": 0,
      //         "fillAlpha": 1,
      //         "fillColor": alt_color,
      //         "offsetX": 0,
      //         "fontSize": 15,
      //         "horizontalPadding": 8,
      //         "verticalPadding": 3,
      //         "shadowAlpha": 0
      //       },
      //       "categoryAxis": {
      //         "autoGridCount": false,
      //         "labelsEnabled": false,
      //         "axisThickness": 0,
      //         "axisAlpha": 0.1,
      //         "gridAlpha": 0,
      //         "gridColor": "#7c8b96",
      //         "startOnAxis": true,
      //         "inside": true,
      //         "tickLength": 2,
      //         "offset": 1,
      //         "gridThickness": 2,
      //         "gridCount": bar_count
      //       },
      //       "valueAxes": [
      //         {
      //           "labelsEnabled": false,
      //           "axisThickness": 0,
      //           "dashLength": 6,
      //           "tickLength": 0,
      //           "gridAlpha": 0.1,
      //           "stackType": "regular",
      //           "gridColor": "#7c8b96",
      //           "zeroGridAlpha": 0,
      //           "autoGridCount": false,
      //           "gridCount": 4
      //         }
      //       ],
      //       "graphs": [
      //         {
      //           "bulletSize": 0,
      //           "bullet": "round",
      //           "bulletBorderThickness": 0,
      //           "minBulletSize": 0,
      //           "animationPlayed": true,
      //           "fillColors": ["#3abfd3", "#49eeca"],
      //           "type": "column",
      //           "valueField": "earn_referral",
      //           "fillAlphas": 1,
      //           "lineAlpha": 0,
      //           "fixedColumnWidth": 2,
      //           "cornerRadiusTop": 1,
      //           "balloon": {
      //             "color": "#3abfd3"
      //           }
      //         }, {
      //           "bulletSize": 0,
      //           "bullet": "round",
      //           "bulletBorderThickness": 0,
      //           "minBulletSize": 0,
      //           "animationPlayed": true,
      //           "fillColors": ["#67cc2e", "#b3f43a"],
      //           "type": "column",
      //           "valueField": "paid_chat_messages",
      //           "fillAlphas": 1,
      //           "lineAlpha": 0,
      //           "fixedColumnWidth": 2,
      //           "cornerRadiusTop": 1,
      //           "balloon": {
      //             "color": "#67cc2e"
      //           }
      //         }, {
      //           "bulletSize": 0,
      //           "bullet": "round",
      //           "bulletBorderThickness": 0,
      //           "minBulletSize": 0,
      //           "animationPlayed": true,
      //           "fillColors": ["#ff9500", "#ffcc00"],
      //           "type": "column",
      //           "valueField": "tips",
      //           "fillAlphas": 1,
      //           "lineAlpha": 0,
      //           "fixedColumnWidth": 2,
      //           "cornerRadiusTop": 1,
      //           "balloon": {
      //             "color": "#ff9500"
      //           }
      //         }, {
      //           "bulletSize": 0,
      //           "bullet": "round",
      //           "bulletBorderThickness": 0,
      //           "minBulletSize": 0,
      //           "animationPlayed": true,
      //           "fillColors": ["#FF3E33", "#FE3F8C"],
      //           "type": "column",
      //           "valueField": "paid_subscriptions",
      //           "fillAlphas": 1,
      //           "lineAlpha": 0,
      //           "fixedColumnWidth": 2,
      //           "cornerRadiusTop": 1,
      //           "balloon": {
      //             "color": "#FF3E33"
      //           }
      //         }
      //       ],
      //       "dataProvider": []
      //     }
      //   );
    },
    fillLineChartsByEmptyPoints() {
      const now = moment()
        .utc()
        .unix();
      for (let i = barCount; i >= 1; i--) {
        let currDate = moment
          .unix(moment.utc(moment.unix(now).format("YYYY-MM-DD HH")).unix())
          .subtract((i * 167) / barCount, "hours")
          .unix();
        this.followers_charts.dataProvider.push({
          date: currDate,
          followers: 0
        });
        this.postsChart.dataProvider.push({
          date: currDate,
          posts: 0,
          views: 0,
          likes: 0,
          comments: 0
        });
        // subscribed_charts.dataProvider.push({
        //   "date": curr_date,
        //   "subscribed": 0,
        //   "unsubscribed": 0
        // });
        // earnings_charts.dataProvider.push({
        //   "date": curr_date,
        //   "paid_subscriptions": 0,
        //   "tips": 0,
        //   "paid_chat_messages": 0,
        //   "earn_referral": 0
        // });
        this.storiesChart.dataProvider.push({
          date: currDate,
          uploads: 0,
          views: 0,
          comments: 0
        });
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
        fontFamily: "Open Sans",
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
    initTitles() {
      const weekAgoDay = moment()
        .subtract(1, "week")
        .format("D MMMM");
      // this.$refs.chartPeriod1.innerHTML = weekAgoDay;
      this.$refs.chartPeriod2.innerHTML = weekAgoDay;
      this.$refs.chartPeriod3.innerHTML = weekAgoDay;
    }
  },
  mounted() {
    this.initLineCharts();
    this.fillLineChartsByEmptyPoints();
    this.initMapCharts();
    this.initTitles();
  }
};
</script>
