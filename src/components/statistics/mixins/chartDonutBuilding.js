import {
  altColor,
  mainColor,
  colorScheme,
  colorSchemes
} from "@/components/statistics/utils/chartVars";

export default {
  methods: {
    initDonutCharts() {
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
        fontFamily: "arial, sans-serif",
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
    }
  }
};
