<template>
  <div ref="container">
    <div v-if="loading">Loading...</div>
  </div>
</template>

<script>
import moment from "moment";
import BrowserStore from "store";
import pluralize from "pluralize";

import CalcCount from "./calcCount";
import BuildScale from "./buildScale";

import { chartTypes, getScaleData } from "./utils";

const altColor = "#16181A";

const typeTitles = {};
const chartColors = {};
Object.entries(chartTypes.posts).forEach(v => {
  typeTitles[v[0]] = pluralize(v[1][0], 2);
  chartColors[v[0]] = v[1][2];
});

export default {
  name: "StatisticsPosts",
  mixins: [CalcCount, BuildScale],
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
      this.buildContainers();
      this.initCharts();
      this.processDataSet();
    },
    updateChartData(data, period, type) {
      // if (type === "view_post") {
      //   console.log(period, Object.values(data.statistics.data));
      // }
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
    updateCount(data, type) {
      const n = this.calcCount(
        data.statistics.data,
        type === "post_like" ? "total" : null
      );
      let counter = document.getElementById(type + "_charts_counter");
      let count = counter.getElementsByClassName("count")[0];
      count.innerHTML = n;
    },
    processData(data) {
      const period = this.period;
      for (let type of Object.keys(chartColors)) {
        switch (data.statistics.code) {
          case type + "_detailed_histogram_" + period:
            this.updateChartData(data, period, type);
            this.updateChart(period, type);
            this.updateCount(data, type);
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
      Object.keys(chartColors).forEach(type => {
        html += this.wrapperHtml(type);
      });
      this.$refs.container.innerHTML = html;
      // this.initCheckboxes();
      Object.keys(chartColors).forEach(type => {
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
           <span class="plural">${typeTitles[type]}</span>
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
        Object.keys(chartColors).forEach(type => {
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
        weekly: {},
        daily: {},
        last_year: {}
      };
      this.barCount = 108;
      const now = moment()
        .utc()
        .unix();

      let period = this.period;

      const { periodType, count, startDate } = getScaleData(period);

      for (let type in chartColors) {
        if (!chartColors.hasOwnProperty(type)) {
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
      this.buildScale(
        document.getElementById("statistics-chart-scale_" + period),
        period,
        now
      );
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
              fillColors: chartColors[type],
              type: "column",
              cornerRadiusTop: 1,
              valueField: type,
              fillAlphas: 1,
              lineAlpha: 0,
              fixedColumnWidth: 2,
              balloon: {
                color: chartColors[type][0]
              }
            }
          ],
          dataProvider: []
        }
      );
    }
  }
};
</script>
