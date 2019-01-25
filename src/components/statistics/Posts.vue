<template>
  <div ref="container">
    <div v-if="loading">Loading...</div>
  </div>
</template>

<script>
import moment from "moment";
import BrowserStore from "store";
// import pluralize from "pluralize";

const altColor = "#16181A";

export default {
  name: "StatisticsPosts",

  props: {
    dataSet: {
      type: Array,
      required: true
    },
    period: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      loading: true,
      chartUpdateTimeoutId: null
    };
  },

  mounted() {
    this.init();
  },

  watch: {
    period() {
      this.init();
    }
  },

  methods: {
    init() {
      this.typeTitles = {
        new_post: "Posts",
        view_post: "Views",
        post_like: "Likes",
        post_comment_added: "Comments"
      };
      this.chartTypes = {
        new_post: ["#FF3E33", "#FE3F8C"],
        view_post: ["#ff9500", "#ffcc00"],
        post_like: ["#67cc2e", "#b3f43a"],
        post_comment_added: ["#3abfd3", "#49eeca"]
      };

      this.buildContainers();
      this.initCharts();
      this.processDataSet();
    },
    updateChartData(data, period, type) {
      const arrValues = {};
      let y = 0;
      for (let j = this.barCount; j >= 1; j--) {
        this.charts[period][type].dataProvider[y][type] = 0;
        y++;
      }
      for (let index in data.statistics.data) {
        if (
          data.statistics.data.hasOwnProperty(index) &&
          (("undefined" !== typeof data.statistics.data[index].total &&
            data.statistics.data[index].total) ||
            ("undefined" === typeof data.statistics.data[index].total &&
              data.statistics.data[index]))
        ) {
          let currIndex = 0,
            diff = 0;
          for (let j = 0; j < this.barCount; j++) {
            let momentDiff = Math.abs(
              this.charts[period][type].dataProvider[j].date - index
            );
            if (0 === j || diff > momentDiff) {
              diff = momentDiff;
              currIndex = j;
            }
          }
          let val = parseFloat(
              this.charts[period][type].dataProvider[currIndex][type]
            ),
            wsVal =
              "undefined" !== typeof data.statistics.data[index].total
                ? data.statistics.data[index].total
                : data.statistics.data[index];
          arrValues[currIndex] = val + wsVal;
        }
      }
      for (let arrIndex in arrValues) {
        if (arrValues.hasOwnProperty(arrIndex)) {
          this.charts[period][type].dataProvider[arrIndex][type] =
            arrValues[arrIndex];
        }
      }
    },
    // updateChart(period, type) {
    //   // if (this.chartUpdateTimeoutId) {
    //   //   clearTimeout(this.chartUpdateTimeoutId);
    //   // }
    //   // this.chartUpdateTimeoutId = setTimeout(() => {
    //   //  this._updateChart(period, type);
    //   // }, 500);
    // },
    updateChart(period, type) {
      this.charts[period][type].validateData();
    },
    processData(data) {
      const period = this.period;
      for (let type of Object.keys(this.chartTypes)) {
        switch (data.statistics.code) {
          case type + "_detailed_histogram_" + period:
            this.updateChartData(data, period, type);
            this.updateChart(period, type);
            break;
          case type + "_count_" + period:
            if ("NaN" !== data.statistics.data) {
              let counter = document.getElementById(type + "_charts_counter");
              let count = counter.getElementsByClassName("count")[0];
              count.innerHTML = data.statistics.data;
            }
            break;
        }
      }
    },
    processDataSet() {
      this.dataSet.forEach(this.processData);
    },
    //
    buildContainers() {
      let html = "";
      Object.keys(this.chartTypes).forEach(type => {
        html += this.wrapperHtml(type);
      });
      this.$refs.container.innerHTML = html;
      // this.initCheckboxes();
      Object.keys(this.chartTypes).forEach(type => {
        this.buildChartContainer(type, this.period);
      });
      this.buildChartScaleContainer(this.$refs.container, this.period);
    },
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
      return `<div class="charts-wrapper-outer charts-wrapper-outer__${type}" id="pmwr_${type}">
         <div class="charts-counter" id="${type}_charts_counter">
           <span class="count">0</span>
           <span class="plural">${this.typeTitles[type]}</span>
         </div>
         <!--
         <label class="statistics-view-toggle-label">
           <input type="checkbox" class="statistics-view-toggle" checked="" data-type="${type}">
           <span></span>
         </label>
         -->
       </div>
      `;
    },
    initCheckboxes() {
      this.sectionsState = BrowserStore.get("statPostsModalSections");
      if (!this.sectionsState) {
        this.sectionsState = {};
        Object.keys(this.chartTypes).forEach(type => {
          this.sectionsState[type] = true;
        });
      }
      const checkboxes = this.$refs.container.getElementsByTagName("input");
      for (let i = 0; i < checkboxes.length; i++) {
        let type = checkboxes[i].getAttribute("data-type");
        checkboxes[i].checked = this.sectionsState[type];
        checkboxes[i].addEventListener("change", e => {
          const el = e.target;
          const type = el.getAttribute("data-type");
          this.sectionsState[type] = el.checked;
          BrowserStore.set("statPostsModalSections", this.sectionsState);
        });
      }
    },
    initCharts() {
      this.charts = {
        today: {},
        last_week: {},
        last_month: {},
        last_year: {}
      };
      this.barCount = 108;
      const now = moment()
        .utc()
        .unix();

      let period = this.period;

      let periodType, count;
      let startDate = now;

      switch (period) {
        case "today":
          count = 1439;
          periodType = "minutes";
          // format = "YYYY-MM-DD HH:mm";
          startDate = moment(
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

      for (let type in this.chartTypes) {
        if (!this.chartTypes.hasOwnProperty(type)) {
          continue;
        }

        this.createChart(type, period);

        // fill chart by null points
        let y = 0;
        for (let j = this.barCount; j >= 1; j--) {
          let currDate = moment
            .unix(startDate)
            .subtract((j * count) / this.barCount, periodType)
            .unix();
          this.charts[period][type].dataProvider[y] = {};
          this.charts[period][type].dataProvider[y].date = currDate;
          y++;
        }
      }
      this.buildScale(period, now);
    },
    createChart(type, period) {
      this.charts[period][type] = window.AmCharts.makeChart(
        type + "_charts_" + period,
        {
          type: "serial",
          categoryField: "date",
          theme: "default",
          fontFamily: "arial, sans-serif",
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
            gridCount: this.barCount
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
              fillColors: this.chartTypes[type],
              type: "column",
              cornerRadiusTop: 1,
              valueField: type,
              fillAlphas: 1,
              lineAlpha: 0,
              fixedColumnWidth: 2,
              balloon: {
                color: this.chartTypes[type][0]
              }
            }
          ],
          dataProvider: []
        }
      );
    },
    buildScale(period, now) {
      const container = document.getElementById(
        "statistics-chart-scale_" + period
      );
      if ("today" !== period) {
        let scaleCount = 5,
          scaleHtml = "",
          periodCount = 1,
          format = "YYYY-MM-DD",
          displayFormat;

        switch (this.period) {
          case "last_week":
            scaleCount = 6;
            displayFormat = "ddd";
            break;
          case "last_month":
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
          let currLabel = moment
            .unix(moment.utc(moment.unix(now).format(format)).unix())
            .subtract(j * periodCount, "days")
            .format(displayFormat);
          scaleHtml +=
            "<span class=statistics-chart-scale__item>" + currLabel + "</span>";
        }
        container.innerHTML = scaleHtml;
      } else {
        container.innerHTML = `
          <span class="statistics-chart-scale__item">0:00</span>
          <span class="statistics-chart-scale__item">4:00</span>
          <span class="statistics-chart-scale__item">8:00</span>
          <span class="statistics-chart-scale__item">12:00</span>
          <span class="statistics-chart-scale__item">16:00</span>
          <span class="statistics-chart-scale__item">20:00</span>
          <span class="statistics-chart-scale__item">24:00</span>
        `;
      }
    }
  }
};
</script>
