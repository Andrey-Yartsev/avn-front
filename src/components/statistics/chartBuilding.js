import { chartOptions, mainColor, barCount } from "./chartVars";
import moment from "moment";
import { dataProviderKeys } from "@/components/statistics/types";

const getScaleData = period => {
  const now = moment()
    .utc()
    .unix();

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
    case "weekly":
      count = 167;
      periodType = "hours";
      // format = "YYYY-MM-DD HH";
      break;
    case "daily":
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

  return {
    count,
    periodType,
    startDate
  };
};

export default {
  methods: {
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
    fillLineChartByEmptyPoints(name) {
      this[name + "Chart"].dataProvider = [];
      const { periodType, count, startDate } = getScaleData(
        this.currentPeriodType
      );
      const keys = {};
      console.log(">>>>>>>>>", periodType, moment.unix(startDate).toDate());
      dataProviderKeys[name].forEach(k => (keys[k] = 0));

      if (this.currentPeriodType === "weekly") {
        if (barCount !== 7) {
          // throw new Error("We need 7 days for weekly period");
        }
        const startOfWeek = moment().startOf("week");
        for (let j = 1; j <= 7; j++) {
          let currDate = moment(startOfWeek).add(j, "days");
          this[name + "Chart"].dataProvider.push(
            Object.assign(
              {
                date: currDate
              },
              keys
            )
          );
        }
        return;
      }

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
    }
  }
};
