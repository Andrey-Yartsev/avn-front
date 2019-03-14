<template>
  <table class="table table_dotts-line">
    <thead>
      <th>Date</th>
      <th>Subscribers</th>
      <th>Funding</th>
      <th>Messages</th>
      <th>Referrals</th>
      <th>Total</th>
    </thead>
    <tbody>
      <tr v-for="v in items" :key="v.id">
        <td>
          <span class="date-item">{{ month(v.date) }}</span>
        </td>
        <td class="line-1">${{ v.paid_subscriptions }}</td>
        <td class="line-2">${{ v.tips }}</td>
        <td class="line-3">${{ v.paid_chat_messages }}</td>
        <td class="line-4">${{ v.earn_referral }}</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import moment from "moment";
import { chartTypes } from "./types";

const isFloat = n => {
  return Number(n) === n && n % 1 !== 0;
};

const monthNumber = 5;

export default {
  name: "statistics-money-table",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    month(date) {
      return "1 " + moment(date).format("MMM");
    }
  },
  computed: {
    items() {
      if (!this.data || !this.data.paid_chat_messages) {
        return [];
      }
      const ranges = [];
      for (let i = 0; i < monthNumber; i++) {
        ranges.push([
          moment().subtract(i + 1, "month"),
          moment().subtract(i, "month")
        ]);
      }

      console.log("..");

      const data = {};
      const lineTypes = Object.keys(chartTypes.earnings);
      lineTypes.forEach(lineType => {
        const statData = this.data[lineType].statData;

        const items = [];
        // fill by null arrays
        ranges.forEach(() => {
          items.push(0);
        });

        Object.entries(statData).forEach(([timestamp, data]) => {
          const date = moment.unix(timestamp);
          ranges.forEach((months, range) => {
            if (date.isBetween(months[0], months[1])) {
              items[range] += parseFloat(data.total);
            }
          });
        });

        data[lineType] = items;
      });

      const result = [];
      for (let i = 0; i < monthNumber; i++) {
        let item = {};
        item.id = i + 1;
        item.date = moment().subtract(i, "month");
        lineTypes.forEach(lineType => {
          if (isFloat(data[lineType][i])) {
            data[lineType][i] = Number(data[lineType][i].toFixed(2));
          }
          item[lineType] = data[lineType][i];
        });
        result.push(item);
      }

      console.log(result);

      return result;
    }
  }
};
</script>
