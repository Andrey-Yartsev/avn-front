<template>
  <div class="popup popup-stream-details">
    <div class="overlay"></div>
    <div class="stream-summary-container">
      <div class="stream-chart-legend">
        <div class="stream-chart-legend-item stream-chart-legend-item__viewers">
          <span class="stream-chart-legend-item-label">Viewers</span>
          <span class="stream-chart-legend-item-value">{{ this.looks.length }}</span>
        </div>
        <div class="stream-chart-legend-item stream-chart-legend-item__likes">
          <span class="stream-chart-legend-item-label">Likes</span>
          <span class="stream-chart-legend-item-value">{{ this.likes.length }}</span>
        </div>
        <div class="stream-chart-legend-item stream-chart-legend-item__tips">
          <span class="stream-chart-legend-item-label">Funds</span>
          <span class="stream-chart-legend-item-value">{{ this.tips }}</span>
        </div>
        <div class="stream-chart-legend-item stream-chart-legend-item__comments">
          <span class="stream-chart-legend-item-label">Comments</span>
          <span class="stream-chart-legend-item-value">{{ this.comments.length }}</span>
        </div>
      </div>
      <div class="stream-details">
        <div class="stream-chart-wrapper">
          <div id="stream-chart" />
          <div class="stream-chart-scale">
            <span
              class="stream-chart-scale__item"
              v-for="item in chartScaleUnits"
              :key="item"
            >{{ item }}</span>
          </div>
        </div>
        <div class="stream-summary-data-wrapper">
          <div class="stream-summary-data-item stream-summary-data-item__duration">
            <div class="stream-summary-data-item__label">Duration</div>
            <div class="stream-summary-data-item__value">{{ this.duration }}</div>
          </div>
          <div class="stream-summary-data-item stream-summary-data-item__viewers">
            <div class="stream-summary-data-item__label">Viewers</div>
            <div class="stream-summary-data-item__value">{{ this.looks.length }}</div>
          </div>
          <div class="stream-summary-data-item stream-summary-data-item__likes">
            <div class="stream-summary-data-item__label">Likes</div>
            <div class="stream-summary-data-item__value">{{ this.likes.length }}</div>
          </div>
          <div class="stream-summary-data-item stream-summary-data-item__tips">
            <div class="stream-summary-data-item__label">Funds</div>
            <div class="stream-summary-data-item__value">{{ this.tips }}</div>
          </div>
          <div class="stream-summary-data-item stream-summary-data-item__comments">
            <div class="stream-summary-data-item__label">Comments</div>
            <div class="stream-summary-data-item__value">{{ this.comments.length }}</div>
          </div>
        </div>
      </div>
      <label class="share-stream-label toggle-wrapper" v-if="canBeSaved">
        Share your video for the next 24 hours so that more people can watch it.
        <div class="toggle-element">
          <input type="checkbox" class="share-stream" v-model="haveToSave">
          <span></span>
        </div>
      </label>
      <div class="mediasBottom" @click="() => this.close(this.haveToSave)">
        <button class="btn alt lg change-devices">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Statistic",
  data() {
    return {
      stream_scale_unit: 0,
      scale_count: 0,
      haveToSave: false,
      scale_format: ""
    };
  },
  props: {
    close: {
      type: Function,
      isRequired: true
    },
    duration: {
      type: String,
      isRequired: true
    },
    streamDuration: {
      type: Number,
      isRequired: true
    },
    streamTimeStart: {
      type: Number,
      isRequired: true
    },
    canBeSaved: {
      type: Boolean,
      isRequired: true
    }
  },
  computed: {
    comments() {
      return this.$store.state.lives.currentLive.statistic
        .stream_comment_search_all.data;
    },
    tips() {
      return this.$store.state.lives.currentLive.statistic.stream_tip_search_all.data
        .reduce((m, i) => {
          return m + +i.message.data_tips_amount;
        }, 0)
        .toFixed(2);
    },
    likes() {
      return this.$store.state.lives.currentLive.statistic
        .stream_like_search_all.data;
    },
    looks() {
      return this.$store.state.lives.currentLive.statistic
        .stream_look_search_all.data;
    },
    chartScaleUnits() {
      const arr = [];
      for (let i = 0; i <= this.scale_count; i++) {
        let item = moment
          .unix(Math.round(i * this.stream_scale_unit))
          .format(this.scale_format);

        arr.push(item);
      }

      console.log(arr);

      return arr;
    }
  },
  methods: {
    buildChart() {
      this.removeChart();
      const scale_format = this.streamDuration < 3600 ? "m:ss" : "HH:mm:ss";
      const bar_count =
        this.streamDuration < bar_count ? this.streamDuration : 47;
      const scale_count =
        this.streamDuration < scale_count ? this.streamDuration : 4;
      const stream_scale_unit = this.streamDuration / scale_count;

      this.scale_count = scale_count;
      this.stream_scale_unit = stream_scale_unit;
      this.scale_format = scale_format;

      const stream_unit_time = this.streamDuration / bar_count;
      const stream_chart = global.AmCharts.makeChart("stream-chart", {
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
        categoryAxis: {
          labelsEnabled: false,
          axisColor: "#fff",
          axisAlpha: 0.2,
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
            gridCount: 4
          }
        ],
        graphs: [
          {
            animationPlayed: true,
            fillAlphas: 0.1,
            lineColor: "#FF335A",
            type: "smoothedLine",
            fillColors: ["#FF335A", "rgba(0,0,0,0)"],
            valueField: "viewers",
            lineThickness: 1.5
          },
          {
            animationPlayed: true,
            fillAlphas: 0.1,
            lineColor: "#ff9500",
            fillColors: ["#ff9500", "rgba(0,0,0,0)"],
            type: "smoothedLine",
            valueField: "likes",
            lineThickness: 1.5
          },
          {
            animationPlayed: true,
            fillAlphas: 0.1,
            lineColor: "#67cc2e",
            fillColors: ["#67cc2e", "rgba(0,0,0,0)"],
            type: "smoothedLine",
            valueField: "tips",
            lineThickness: 1.5
          },
          {
            animationPlayed: true,
            fillAlphas: 0.1,
            lineColor: "#3abfd3",
            fillColors: ["#3abfd3", "rgba(0,0,0,0)"],
            type: "smoothedLine",
            valueField: "comments",
            lineThickness: 1.5
          }
        ],
        dataProvider: []
      });

      for (var i = 0; i < bar_count; i++) {
        stream_chart.dataProvider.push({
          date: Math.round(this.streamTimeStart + i * stream_unit_time),
          viewers: 0,
          likes: 0,
          tips: 0,
          comments: 0
        });
      }

      stream_chart.validateData();

      // onPing(function(data) {
      //   if ("undefined" !== typeof data.statistics) {
      //     if (
      //       "undefined" !== typeof SHOWED_STATISTICS[data.statistics.code] &&
      //       SHOWED_STATISTICS[data.statistics.code] > data.statistics.time
      //     ) {
      //       return;
      //     }
      //     SHOWED_STATISTICS[data.statistics.code] = data.statistics.time;
      //     switch (data.statistics.code) {
      //       case "stream_look_search_all":
      //         var approx_arr = {};
      //         data.statistics.data.forEach(function(item) {
      //           var timestamp = moment(item.message.timestamp).format("X");
      //           var curr_index = 0,
      //             diff = 0;
      //           for (var ii = 0; ii < bar_count; ii++) {
      //             var moment_diff = Math.abs(
      //               stream_chart.dataProvider[ii].date - timestamp
      //             );
      //             if (0 === ii || diff > moment_diff) {
      //               diff = moment_diff;
      //               curr_index = ii;
      //             }
      //           }
      //           var val =
      //             "undefined" !== typeof approx_arr[curr_index]
      //               ? approx_arr[curr_index]
      //               : 0;
      //           approx_arr[curr_index] = val + 1;
      //         });
      //         for (var i in approx_arr) {
      //           stream_chart.dataProvider[i].viewers = approx_arr[i];
      //         }
      //         stream_chart.validateData();
      //         break;
      //       case "stream_like_search_all":
      //         var approx_arr = {};
      //         data.statistics.data.forEach(function(item) {
      //           var timestamp = moment(item.message.timestamp).format("X");
      //           var curr_index = 0,
      //             diff = 0;
      //           for (var ii = 0; ii < bar_count; ii++) {
      //             var moment_diff = Math.abs(
      //               stream_chart.dataProvider[ii].date - timestamp
      //             );
      //             if (0 === ii || diff > moment_diff) {
      //               diff = moment_diff;
      //               curr_index = ii;
      //             }
      //           }
      //           var val =
      //             "undefined" !== typeof approx_arr[curr_index]
      //               ? approx_arr[curr_index]
      //               : 0;
      //           approx_arr[curr_index] = val + 1;
      //         });
      //         for (var i in approx_arr) {
      //           stream_chart.dataProvider[i].likes = approx_arr[i];
      //         }
      //         stream_chart.validateData();
      //         break;
      //       case "stream_comment_search_all":
      //         var approx_arr = {};
      //         data.statistics.data.forEach(function(item) {
      //           var timestamp = moment(item.message.timestamp).format("X");
      //           var curr_index = 0,
      //             diff = 0;
      //           for (var ii = 0; ii < bar_count; ii++) {
      //             var moment_diff = Math.abs(
      //               stream_chart.dataProvider[ii].date - timestamp
      //             );
      //             if (0 === ii || diff > moment_diff) {
      //               diff = moment_diff;
      //               curr_index = ii;
      //             }
      //           }
      //           var val =
      //             "undefined" !== typeof approx_arr[curr_index]
      //               ? approx_arr[curr_index]
      //               : 0;
      //           approx_arr[curr_index] = val + 1;
      //         });
      //         for (var i in approx_arr) {
      //           stream_chart.dataProvider[i].comments = approx_arr[i];
      //         }
      //         stream_chart.validateData();
      //         break;
      //       case "stream_tip_search_all":
      //         var approx_arr = {};
      //         data.statistics.data.forEach(function(item) {
      //           var timestamp = moment(item.message.timestamp).format("X");
      //           var curr_index = 0,
      //             diff = 0;
      //           for (var ii = 0; ii < bar_count; ii++) {
      //             var moment_diff = Math.abs(
      //               stream_chart.dataProvider[ii].date - timestamp
      //             );
      //             if (0 === ii || diff > moment_diff) {
      //               diff = moment_diff;
      //               curr_index = ii;
      //             }
      //           }
      //           var val =
      //             "undefined" !== typeof approx_arr[curr_index]
      //               ? approx_arr[curr_index]
      //               : 0;
      //           approx_arr[curr_index] = val + 1;
      //         });
      //         for (var i in approx_arr) {
      //           stream_chart.dataProvider[i].tips = approx_arr[i];
      //         }
      //         stream_chart.validateData();
      //         break;
      //     }
      //   }
      // });
      // getUserStatistics("stream_look_search_all", {
      //   stream_id: streamId
      // });
      // getUserStatistics("stream_like_search_all", {
      //   stream_id: streamId
      // });

      // if (ENABLE_CHAT_SERVICE) {
      //   StreamComments.getStats(function(response) {
      //     var approx_arr = {};
      //     response.messages.forEach(function(item) {
      //       var timestamp = moment(item.date).format("X");
      //       var curr_index = 0;
      //       var diff = 0;
      //       for (var ii = 0; ii < bar_count; ii++) {
      //         var moment_diff = Math.abs(
      //           stream_chart.dataProvider[ii].date - timestamp
      //         );
      //         if (0 === ii || diff > moment_diff) {
      //           diff = moment_diff;
      //           curr_index = ii;
      //         }
      //       }
      //       var val =
      //         "undefined" !== typeof approx_arr[curr_index]
      //           ? approx_arr[curr_index]
      //           : 0;
      //       approx_arr[curr_index] = val + item.count;
      //     });

      //     for (var i in approx_arr) {
      //       stream_chart.dataProvider[i].comments = approx_arr[i];
      //     }
      //     stream_chart.validateData();
      //   });
      // } else {
      //   // getUserStatistics("stream_comment_search_all", {
      //   //   stream_id: streamId
      //   // });
      // }

      // getUserStatistics("stream_tip_search_all", {
      //   stream_id: streamId
      // });
    },
    removeChart() {
      if (this.chart) {
        this.chart.dispose();
      }
    }
  },
  mounted() {
    this.buildChart();
  },
  beforeDestroy() {
    this.removeChart();
  },
  watch: {
    comments() {
      this.buildChart();
    },
    tips() {
      this.buildChart();
    },
    likes() {
      this.buildChart();
    },
    looks() {
      this.buildChart();
    }
  }
};
</script>
