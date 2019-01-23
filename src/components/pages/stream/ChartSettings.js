export default {
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
      valueField: "look",
      lineThickness: 1.5
    },
    {
      animationPlayed: true,
      fillAlphas: 0.1,
      lineColor: "#3abfd3",
      fillColors: ["#3abfd3", "rgba(0,0,0,0)"],
      type: "smoothedLine",
      valueField: "like",
      lineThickness: 1.5
    },
    {
      animationPlayed: true,
      fillAlphas: 0.1,
      lineColor: "#67cc2e",
      fillColors: ["#67cc2e", "rgba(0,0,0,0)"],
      type: "smoothedLine",
      valueField: "tip",
      lineThickness: 1.5
    },
    {
      animationPlayed: true,
      fillAlphas: 0.1,
      lineColor: "#ff9500",
      fillColors: ["#ff9500", "rgba(0,0,0,0)"],
      type: "smoothedLine",
      valueField: "comment",
      lineThickness: 1.5
    }
  ],
  dataProvider: []
};
