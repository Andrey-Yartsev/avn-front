const altColor = "#16181A";

const chartOptions = {
  type: "serial",
  categoryField: "date",
  theme: "default",
  fontFamily: "arial, sans-serif",
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
  ]
};

const mainColor = "#fff";
const barCount = 7;
const colorScheme = 1;

export { chartOptions, altColor, mainColor, barCount, colorScheme };
