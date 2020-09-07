import { chartOptions, mainColor, altColor } from "./chartVars";
import moment from "moment";
import { dataProviderKeys, getScaleData } from "./utils";

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
        case "earnings":
          this.buildEarningsChart();
          break;
      }
    },
    buildEarningsChart() {
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
          // animationDuration: 0,
          // borderThickness: 0,
          // fadeOutDuration: 0,
          // fillAlpha: 1,
          fillColor: altColor
          // offsetX: 0,
          // fontSize: 15,
          // horizontalPadding: 8,
          // verticalPadding: 3,
          // shadowAlpha: 0
        },
        // categoryAxis: {
        //   autoGridCount: false,
        //   labelsEnabled: false,
        //   axisThickness: 0,
        //   axisAlpha: 0.1,
        //   gridAlpha: 0,
        //   gridColor: "#7c8b96",
        //   startOnAxis: true,
        //   inside: true,
        //   tickLength: 2,
        //   offset: 1,
        //   gridThickness: 2
        //   // gridCount: barCount
        // },
        valueAxes: [
          {
            labelsEnabled: false,
            axisThickness: 0,
            dashLength: 6,
            tickLength: 0,
            gridAlpha: 0.1,
            // stackType: "regular",
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
      const { units, count, startDate, barCount } = getScaleData(
        this.currentPeriodType
      );

      console.log("barCount=", barCount);

      if (!units) {
        throw new Error("units is not defined");
      }

      const keys = {};
      dataProviderKeys[name].forEach(k => (keys[k] = 0));

      if (this.currentPeriodType === "weekly") {
        // TODO возможен рефакторинг
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

      // console.log("======================", units, barCount);

      for (let i = barCount; i >= 1; i--) {
        let currDate = moment
          .unix(startDate)
          .subtract((i * count) / barCount, units)
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
