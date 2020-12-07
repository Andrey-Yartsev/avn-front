import { startOfWeek, sub, add, format, startOfDay } from "date-fns";
import { getScaleData } from "@/components/statistics/utils/common";

export default {
  methods: {
    buildScale(container, period, now) {
      if ("today" !== period) {
        let scaleHtml = "";

        const {
          scaleCount,
          unitsInBar,
          displayFormat,
          units,
          startFromFirstDayOfWeek
        } = getScaleData(period);

        if (startFromFirstDayOfWeek) {
          let weekStart = startOfWeek(new Date());
          for (let j = 1; j <= scaleCount; j++) {
            let currLabel = format(
              add(weekStart, { [units]: j }),
              displayFormat
            );
            scaleHtml +=
              "<span class=statistics-chart-scale__item>" +
              currLabel +
              "</span>";
          }
        } else {
          for (let j = scaleCount - 1; j >= 0; j--) {
            let currLabel = format(
              sub(startOfDay(new Date(now + 1000)), {
                [units]: j * unitsInBar
              }),
              displayFormat
            );
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
