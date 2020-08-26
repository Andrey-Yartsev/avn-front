import ws from "@/ws";
import {
  chartTypes,
  lineTypes,
  periodTypeNames,
  periodTypes,
  chartDataSets
} from "@/components/statistics/types";
import CalcCount from "./calcCount";
import moment from "moment";
import pluralize from "pluralize";
import { barCount } from "./chartVars";

//
// abstract: currentPeriodType
// abstract: sendWsRequests()
//

// const matchCodeByPrefix = (code, prefix) => {
//   return code.match(new RegExp(`${prefix}_(.*)`));
// };

const chartStorage = {};
Object.keys(chartTypes).forEach(chartType => {
  chartStorage[chartType] = {};
  for (let periodType of periodTypeNames) {
    chartStorage[chartType][periodType] = [];
  }
});

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

export default {
  mixins: [CalcCount],
  data() {
    return {
      subscribedWsCodes: [],
      showedStats: {},
      updateChartAttempts: {},
      updateChartTimeoutIds: {},
      updateDataTimeoutIds: {},
      chartDataSets
    };
  },
  methods: {
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
    // --------------------
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
      this.processData(data, true);
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
      }
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
      const firstBarTime = chart.dataProvider[0].date.unix();
      // console.log(statData);

      // Дебаг дат баров
      console.log(chart.dataProvider.length);
      chart.dataProvider.map(v => {
        console.log("DoFWEEK", new Date(v.date));
      });

      // statData = {
      //   1598216400: 1, // monday
      //   1598302800: 2, // tusday
      //   1598734800: 4 // sunday
      // };

      for (let pointTime of Object.keys(statData)) {
        console.log("POINT TIME", moment.unix(pointTime).toDate());
        if (pointTime < firstBarTime) {
          // Необходимо проверить имеет ли точка время меньшее чем первый бар
          // И если так, мы игнорируем ее
          console.error("POINT IS LESS THEN FIRST BAR TIME", {
            pointTime,
            firstBarTime
          });
          continue;
        }
        let currIndex = 0;
        let diff = 0;
        // Для каждой точки ищем подходящее место в плоте
        for (let j = 0; j < barCount; j++) {
          let momentDiff = Math.abs(
            chart.dataProvider[j].date.unix() - pointTime
          );
          // Находим бар, имеющий координаты немного меньше или равные точке
          if (0 === j || diff >= momentDiff) {
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
          v = statData[pointTime][statDataSubKey];
        } else {
          v = statData[pointTime];
        }
        approx[currIndex] = val + v;
      }
      console.log({ approx });
      for (let i in approx) {
        chart.dataProvider[i][dataProviderKey] = approx[i];
      }
    }
  }
};
