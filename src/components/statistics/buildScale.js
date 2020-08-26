import moment from "moment";

export default {
  methods: {
    buildScale(container, period, now) {
      if ("today" !== period) {
        let scaleCount = 5,
          scaleHtml = "",
          periodCount = 1,
          format = "YYYY-MM-DD",
          displayFormat;

        let unit = "days";

        switch (period) {
          case "weekly":
            scaleCount = 7;
            displayFormat = "ddd";
            break;
          case "daily":
            periodCount = 5;
            displayFormat = "D.MM";
            break;
          case "last_year":
            // scaleCount = 6;
            periodCount = 2;
            unit = "months";
            format = "YYYY-MM";
            displayFormat = "MMM";
            break;
        }

        let startOfWeek = moment().startOf("week");
        if (period === "weekly") {
          for (let j = 1; j <= 7; j++) {
            let currLabel = moment(startOfWeek)
              .add(j, unit)
              .format(displayFormat);
            scaleHtml +=
              "<span class=statistics-chart-scale__item>" +
              currLabel +
              "</span>";
          }
          container.innerHTML = scaleHtml;
          return;
        }

        for (let j = scaleCount; j >= 0; j--) {
          let currLabel = moment
            .unix(moment.utc(moment.unix(now).format(format)).unix())
            .subtract(j * periodCount, unit)
            .format(displayFormat);
          scaleHtml +=
            "<span class=statistics-chart-scale__item>" + currLabel + "</span>";
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
