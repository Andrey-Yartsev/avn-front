<template>
  <div ref="container">
    <div v-if="loading">Loading...</div>
  </div>
</template>

<script>
import moment from "moment";
// import pluralize from "pluralize";

const altColor = "#16181A";

export default {
  name: "StatisticsPosts",

  props: {
    data: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      loading: true
    };
  },

  mounted() {
    this.initPosts();
  },

  watch: {
    data() {
      if (this.loading) {
        this.loading = false;
      }
      this.setData();
    }
  },

  methods: {
    buildChartContainer(type, period) {
      const parent = document.getElementById("pmwr_" + type);
      const chartWrapper = document.createElement("div");
      chartWrapper.setAttribute("id", type + "_charts_" + period);
      chartWrapper.setAttribute("class", "charts-wrapper");
      parent.appendChild(chartWrapper);
      return chartWrapper;
    },
    buildChartScaleContainer(parent, period) {
      const scaleWrapper = document.createElement("div");
      scaleWrapper.setAttribute("id", "statistics-chart-scale_" + period);
      scaleWrapper.setAttribute("class", "statistics-chart-scale");
      parent.appendChild(scaleWrapper);
      return scaleWrapper;
    },
    wrapperHtml(type) {
      return `<div class="charts-wrapper-outer charts-wrapper-outer__new_post" id="pmwr_${type}">
         <div class="charts-counter" id="${type}_charts_today_counter">
           <span class="count">0</span>
           <span class="plural">Posts</span>
         </div>
         <label class="statistics-view-toggle-label">
           <input type="checkbox" class="statistics-view-toggle" checked="">
           <span></span>
         </label>
       </div>
      `;
    },
    buildContainers() {
      let html = "";
      Object.keys(this.charts_types).forEach(type => {
        html += this.wrapperHtml(type);
      });
      this.$refs.container.innerHTML = html;
      Object.keys(this.charts_types).forEach(type => {
        this.buildChartContainer(type, "last_week");
      });
      this.buildChartScaleContainer(this.$refs.container, "last_week");
    },
    initPosts() {
      this.charts_types = {
        new_post: ["#FF3E33", "#FE3F8C"],
        view_post: ["#ff9500", "#ffcc00"],
        post_like: ["#67cc2e", "#b3f43a"],
        post_comment_added: ["#3abfd3", "#49eeca"]
      };

      this.buildContainers();
      this.init();
      // this.setData();
    },
    createDropdown() {
      // <div class="stat-period-select">
      //   <span role="button" class="popup-menu-btn" data-toggle="stat-period-select"
      //     data-placement-h="right">Today</span>
      //   <div class="popup-menu" id="stat-period-select">
      //     <span role="button" data-period="today" class="popup-menu-item">Today</span>
      //     <span role="button" data-period="last_week" class="popup-menu-item">Last week</span>
      // <span role="button" data-period="last_month" class="popup-menu-item">Last Month</span>
      //     <span role="button" data-period="last_year" class="popup-menu-item">Last Year</span></div>
      //   </div>
    },
    setData() {
      this.data.forEach(this.processDataItem);
    },
    createChart(type, period) {
      this.charts[period][type] = window.AmCharts.makeChart(
        type + "_charts_" + period,
        {
          type: "serial",
          categoryField: "date",
          theme: "default",
          fontFamily: "Open Sans",
          color: "#7c8b96",
          autoDisplay: true,
          autoMarginOffset: 5,
          addClassNames: true,
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
            gridCount: this.bar_count
          },
          valueAxes: [
            {
              showFirstLabel: false,
              showLastLabel: false,
              integersOnly: true,
              autoGridCount: true,
              axisThickness: 0,
              dashLength: 6,
              tickLength: 0,
              gridAlpha: 0.1,
              gridColor: "#7c8b96",
              zeroGridAlpha: 0,
              labelOffset: 10
            }
          ],
          graphs: [
            {
              animationPlayed: true,
              fillColors: this.charts_types[type],
              type: "column",
              cornerRadiusTop: 1,
              valueField: type,
              fillAlphas: 1,
              lineAlpha: 0,
              fixedColumnWidth: 2,
              balloon: {
                color: this.charts_types[type][0]
              }
            }
          ],
          dataProvider: []
        }
      );
    },
    init() {
      this.charts = {
        // today: {},
        last_week: {}
        // last_month: {},
        // last_year: {}
      };
      this.bar_count = 108;
      const now = moment()
        .utc()
        .unix();

      for (let period in this.charts) {
        if (this.charts.hasOwnProperty(period)) {
          var periodType, count;
          var start_date = now;

          switch (period) {
            case "today":
              count = 1439;
              periodType = "minutes";
              // format = "YYYY-MM-DD HH:mm";
              start_date = moment(
                moment
                  .unix(now)
                  .add(1, "d")
                  .format("YYYY-MM-DD")
              ).unix();
              break;
            case "last_week":
              count = 167;
              periodType = "hours";
              // format = "YYYY-MM-DD HH";
              break;
            case "last_month":
              count = 719;
              periodType = "hours";
              // format = "YYYY-MM-DD HH";
              break;
            case "last_year":
              count = 364;
              periodType = "days";
              // format = "YYYY-MM-DD";
              break;
          }

          for (let type in this.charts_types) {
            if (!this.charts_types.hasOwnProperty(type)) {
              continue;
            }

            // this.buildChartContainer(index + "_charts_" + i);
            this.createChart(type, period);

            let y = 0;
            for (let ii = this.bar_count; ii >= 1; ii--) {
              let curr_date = moment
                .unix(start_date)
                .subtract((ii * count) / this.bar_count, periodType)
                .unix();
              this.charts[period][type].dataProvider[y] = {};
              this.charts[period][type].dataProvider[y].date = curr_date;
              // charts[i][index].dataProvider[y][index] = 0;
              y++;
            }
          }
          this.buildScale(period, now);
        }
      }
    },
    buildScale(period, now) {
      if ("today" !== period) {
        let scaleCount = 5,
          scaleHtml = "",
          periodCount = 1,
          period = "last_week",
          format = "YYYY-MM-DD",
          displayFormat;

        switch (period) {
          case "last_week":
            // momentSubstractUnits = "days";
            scaleCount = 6;
            displayFormat = "ddd";
            break;
          case "last_month":
            // momentSubstractUnits = "months";
            periodCount = 5;
            displayFormat = "D.MM";
            break;
          case "last_year":
            periodCount = 2;
            period = "months";
            format = "YYYY-MM";
            displayFormat = "MMM";
            break;
        }
        for (let j = scaleCount; j >= 0; j--) {
          console.log(periodCount, period);
          let currLabel = moment
            .unix(moment.utc(moment.unix(now).format(format)).unix())
            .subtract(j * periodCount, "days")
            .format(displayFormat);
          scaleHtml +=
            "<span class=statistics-chart-scale__item>" +
            currLabel +
            ", </span>";
        }
        let container = document.getElementById(
          "statistics-chart-scale_" + period
        );
        container.innerHTML = scaleHtml;
      }
    },
    processDataItem(data) {
      const charts_types = this.charts_types;
      const charts = this.charts;

      for (var i in charts) {
        if (charts.hasOwnProperty(i)) {
          for (var index in charts_types) {
            if (charts_types.hasOwnProperty(index)) {
              switch (data.statistics.code) {
                case index + "_detailed_histogram_" + i:
                  var arr_values = {},
                    y = 0;
                  for (let ii = this.bar_count; ii >= 1; ii--) {
                    charts[i][index].dataProvider[y][index] = 0;
                    y++;
                  }
                  for (var index1 in data.statistics.data) {
                    if (
                      data.statistics.data.hasOwnProperty(index1) &&
                      (("undefined" !==
                        typeof data.statistics.data[index1].total &&
                        data.statistics.data[index1].total) ||
                        ("undefined" ===
                          typeof data.statistics.data[index1].total &&
                          data.statistics.data[index1]))
                    ) {
                      var curr_index = 0,
                        diff = 0;
                      for (let ii = 0; ii < this.bar_count; ii++) {
                        var moment_diff = Math.abs(
                          charts[i][index].dataProvider[ii].date - index1
                        );
                        if (0 === ii || diff > moment_diff) {
                          diff = moment_diff;
                          curr_index = ii;
                        }
                      }
                      var val = parseFloat(
                          charts[i][index].dataProvider[curr_index][index]
                        ),
                        ws_val =
                          "undefined" !==
                          typeof data.statistics.data[index1].total
                            ? data.statistics.data[index1].total
                            : data.statistics.data[index1];
                      arr_values[curr_index] = val + ws_val;
                    }
                  }
                  for (var arr_index in arr_values) {
                    if (arr_values.hasOwnProperty(arr_index)) {
                      charts[i][index].dataProvider[arr_index][index] =
                        arr_values[arr_index];
                    }
                  }
                  charts[i][index].validateData();
                  break;
                case index + "_count_" + i:
                  if ("NaN" !== data.statistics.data) {
                    // if (
                    //   $("#" + index + "_charts_" + i + "_counter .plural")
                    //     .length
                    // ) {
                    //   $("#" + index + "_charts_" + i + "_counter").html(
                    //     "<span class=count>" +
                    //       data.statistics.data +
                    //       "</span> <span class=plural>" +
                    //       pluralize(
                    //         $(
                    //           "#" + index + "_charts_" + i + "_counter .plural"
                    //         ).text(),
                    //         data.statistics.data,
                    //         false
                    //       ) +
                    //       "</span>"
                    //   );
                    // } else {
                    //   $("#" + index + "_charts_" + i + "_counter .count").html(
                    //     data.statistics.data
                    //   );
                    // }
                  }
                  break;
              }
            }
          }
        }
      }
    }
  }
};
</script>
