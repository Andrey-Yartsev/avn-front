import moment from "moment";
import { getScaleData } from "./utils";

export default {
  methods: {
    buildScale(container, period, now) {
      if ("today" !== period) {
        let scaleHtml = "";
        let format = "YYYY-MM-DD";

        const {
          scaleCount,
          unitsInBar,
          displayFormat,
          units,
          startFromFirstDayOfWeek
        } = getScaleData(period);

        if (startFromFirstDayOfWeek) {
          let startOfWeek = moment().startOf("week");
          for (let j = 1; j <= scaleCount; j++) {
            let currLabel = moment(startOfWeek)
              .add(j, units)
              .format(displayFormat);
            scaleHtml +=
              "<span class=statistics-chart-scale__item>" +
              currLabel +
              "</span>";
          }
        } else {
          console.log("displayFormat", displayFormat);
          for (let j = scaleCount - 1; j >= 0; j--) {
            let currLabel = moment
              .unix(moment.utc(moment.unix(now).format(format)).unix())
              .subtract(j * unitsInBar, units)
              .format(displayFormat);
            scaleHtml +=
              "<span class=statistics-chart-scale__item>" +
              currLabel +
              "</span>";
          }
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
