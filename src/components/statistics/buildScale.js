import moment from "moment";

export default {
  methods: {
    buildScale(container, period, now) {
      if ("today" !== period) {
        let barCount = 5,
          scaleHtml = "",
          periodCount = 1,
          format = "YYYY-MM-DD",
          displayFormat;

        let unit = "days";
        let startFromFirstDayOfWeek = false;

        console.log("period", period);
        switch (period) {
          case "weekly":
            barCount = 7;
            startFromFirstDayOfWeek = true;
            displayFormat = "ddd";
            break;
          case "daily":
            periodCount = 5;
            barCount = 7;
            displayFormat = "D.MM";
            break;
          case "monthly":
            periodCount = 12;
            barCount = 12;
            displayFormat = "MM";
            break;
          case "yearly":
            // barCount = 6;
            barCount = 5;
            periodCount = 2;
            unit = "months";
            format = "YYYY-MM";
            displayFormat = "MMM";
            break;
        }

        if (startFromFirstDayOfWeek) {
          let startOfWeek = moment().startOf("week");
          for (let j = 1; j <= barCount; j++) {
            let currLabel = moment(startOfWeek)
              .add(j, unit)
              .format(displayFormat);
            scaleHtml +=
              "<span class=statistics-chart-scale__item>" +
              currLabel +
              "</span>";
          }
        } else {
          for (let j = barCount; j >= 0; j--) {
            let currLabel = moment
              .unix(moment.utc(moment.unix(now).format(format)).unix())
              .subtract(j * periodCount, unit)
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
