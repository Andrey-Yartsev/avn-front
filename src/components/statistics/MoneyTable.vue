<template>
  <div>
    <div class="b-stat-info__header">
      <div class="value-data current">
        <div class="value-data__name">
          Balance
        </div>
        <div class="value-data__num line-4">${{ balance }}</div>
      </div>
      <div class="value-data text-right">
        <div class="value-data__name">
          Overall payouts
        </div>
        <div class="value-data__num default-color">${{ payouts }}</div>
      </div>
    </div>

    <component :is="scrollableComponent" class="financeTable">
      <table class="table table_dotts-line" v-if="items.length">
        <thead>
          <th><span>Date</span></th>
          <th><span>Subscribers</span></th>
          <th><span>Tipping</span></th>
          <th><span>Messages</span></th>
          <th><span>Referrals</span></th>
          <th><span>Clips</span></th>
          <th><span>Votes</span></th>
          <th><span>Total</span></th>
        </thead>
        <tbody>
          <tr v-for="(v, i) in items2" :key="i">
            <td>
              <span class="date-item">{{ formatTimestamp(v.timestamp) }}</span>
            </td>
            <td class="line-1">${{ v.values.earnSubscribes || 0 }}</td>
            <td class="line-4">${{ v.values.earnTips || 0 }}</td>
            <td class="line-3">${{ v.values.earnChatMessages || 0 }}</td>
            <td class="line-2">${{ v.values.earnReferral || 0 }}</td>
            <td class="line-0">${{ v.values.earnClips || 0 }}</td>
            <td class="line-0">${{ v.values.earnVotes || 0 }}</td>
            <td>${{ v.total }}</td>
          </tr>
        </tbody>
      </table>
    </component>
  </div>
</template>

<script>
import {
  getTime,
  sub,
  format,
  isWithinInterval,
  startOfMonth,
  startOfYear,
  addDays,
  addMonths,
  startOfDay
} from "date-fns";
import { chartTypes } from "./utils";

const dataTypes = [
  "earnSubscribes",
  "earnTips",
  "earnChatMessages",
  "earnReferral",
  "earnClips",
  "earnVotes"
];

const isFloat = n => {
  return Number(n) === n && n % 1 !== 0;
};

const monthNumber = 5;
const lineTypes = Object.keys(chartTypes.earnings);

export default {
  name: "statistics-money-table",
  props: ["data", "currentPeriodType"],
  computed: {
    scrollableComponent() {
      return this.$mq === "mobile" ? "div" : "perfect-scrollbar";
    },
    itemsOld() {
      if (!this.data) {
        return [];
      }
      for (let t of lineTypes) {
        if (!this.data[t]) {
          return [];
        }
      }

      const ranges = [];
      for (let i = 0; i < monthNumber; i++) {
        ranges.push([
          sub(new Date(), { month: i + 1 }),
          sub(new Date(), { month: i })
        ]);
      }

      const data = {};

      lineTypes.forEach(lineType => {
        const statData = this.data[lineType].statData;
        const items = [];

        // fill by nulls
        ranges.forEach(() => {
          items.push(0);
        });

        Object.entries(statData).forEach(([timestamp, data]) => {
          const date = new Date(parseInt(timestamp) + 1000);
          ranges.forEach((months, range) => {
            if (
              isWithinInterval(date, {
                start: new Date(months[0]),
                end: new Date(months[1])
              })
            ) {
              items[range] += parseFloat(data.total);
            }
          });
        });

        data[lineType] = items;
      });

      const result = [];
      let total;
      for (let i = 0; i < monthNumber; i++) {
        let item = {};
        total = 0;
        item.id = i + 1;
        item.date = sub(new Date(), { months: i });
        lineTypes.forEach(lineType => {
          if (isFloat(data[lineType][i])) {
            data[lineType][i] = Number(data[lineType][i].toFixed(2));
          }
          item[lineType] = data[lineType][i];
          total += data[lineType][i];
        });
        item.total = total;
        result.push(item);
      }

      return result;
    },
    items() {
      if (!this.finance) {
        return [];
      }
      const items = [];

      const dummy = {};
      dataTypes.forEach(dataType => {
        dummy[dataType] = 0;
      });
      this.ranges.forEach(() => {
        items.push({ ...dummy });
      });

      dataTypes.forEach(dataType => {
        Object.entries(this.finance[dataType]).forEach(([timestamp, value]) => {
          const date = new Date(parseInt(timestamp) + 1000);
          this.ranges.forEach((_ranges, range) => {
            if (
              isWithinInterval(date, {
                start: new Date(_ranges[0]),
                end: new Date(_ranges[1])
              })
            ) {
              items[range][dataType] += value;
            }
          });
        });
      });
      items.forEach((item, i) => {
        items[i].total = 0;
        items[i].date = this.ranges[i][1];
        dataTypes.forEach(dataType => {
          items[i][dataType] = Math.round(items[i][dataType] * 100) / 100;
          items[i].total += items[i][dataType];
        });
        items[i].total = Math.round(items[i].total * 100) / 100;
      });
      return items.reverse();
    },
    // items() {
    //   if (!this.finance) {
    //     return [];
    //   }
    //   const items = [];
    //
    //   const dummy = {};
    //   dataTypes.forEach(dataType => {
    //     dummy[dataType] = 0;
    //   });
    //   this.ranges.forEach(() => {
    //     items.push({ ...dummy });
    //   });
    //
    //   dataTypes.forEach(dataType => {
    //     Object.entries(this.finance[dataType]).forEach(([timestamp, value]) => {
    //       const date = moment.unix(timestamp);
    //       this.ranges.forEach((_ranges, range) => {
    //         if (date.isBetween(_ranges[0], _ranges[1])) {
    //           items[range][dataType] += value;
    //         }
    //       });
    //     });
    //   });
    //   items.forEach((item, i) => {
    //     items[i].total = 0;
    //     items[i].date = this.ranges[i][1];
    //     dataTypes.forEach(dataType => {
    //       items[i][dataType] = Math.round(items[i][dataType] * 100) / 100;
    //       items[i].total += items[i][dataType];
    //     });
    //     items[i].total = Math.round(items[i].total * 100) / 100;
    //   });
    //   return items.reverse();
    // },
    items2() {
      if (!this.finance) {
        return [];
      }
      const data = {};
      dataTypes.forEach(dataType => {
        Object.entries(this.finance[dataType]).forEach(([timestamp, value]) => {
          if (!data[timestamp]) {
            data[timestamp] = {};
          }
          data[timestamp][dataType] = value;
        });
      });
      const items = [];
      Object.entries(data).forEach(([timestamp, values]) => {
        timestamp = parseInt(timestamp);
        items.push({
          timestamp,
          values
        });
      });
      for (let item of items) {
        let total = 0;
        for (let value of Object.values(item.values)) {
          total += value;
        }
        total = Math.round(total * 100) / 100;
        item.total = total;
      }
      items.sort((n1, n2) => n1 - n2);
      return items;
    },
    finance() {
      return this.$store.state.stats.fetchFinanceResult;
    },
    balance() {
      if (!this.finance) {
        return "-";
      }
      return this.finance.currentBalance;
    },
    payouts() {
      if (!this.finance) {
        return "-";
      }
      return this.finance.overallPayouts;
    },
    ranges() {
      const ranges = [];
      let rangeNumber;
      if (this.currentPeriodType === "daily") {
        rangeNumber = 5;
        let step = Math.round(30 / rangeNumber);
        for (let i = 0; i < rangeNumber; i++) {
          ranges.push([
            addDays(startOfMonth(new Date()), i * step),
            addDays(startOfMonth(new Date()), (i + 1) * step)
          ]);
        }
      } else if (this.currentPeriodType === "weekly") {
        rangeNumber = 7;
        for (let i = rangeNumber - 1; i >= 0; i--) {
          ranges.push([
            sub(new Date(), { days: i + 1 }),
            sub(new Date(), { days: i })
          ]);
        }
      } else if (this.currentPeriodType === "last_year") {
        rangeNumber = 12;
        for (let i = 0; i < rangeNumber; i++) {
          let a = getTime(startOfYear(addMonths(new Date(), i - 1)));
          if (a > getTime(new Date())) {
            continue;
          }
          ranges.push([a, startOfYear(addMonths(new Date(), i))]);
        }
      } else {
        ranges.push([startOfDay(new Date()), startOfDay(new Date())]);
      }
      return ranges;
    }
  },
  methods: {
    formatTimestamp(timestamp) {
      const date = new Date(parseInt(timestamp) * 1000);
      switch (this.currentPeriodType) {
        case "daily":
          return format(date, "d MMM");
        case "weekly":
          return format(date, "d MMM");
        case "monthly":
          return format(date, "MMM yyyy");
        case "all":
          return format(date, "yyyy");
        default:
          return format(date, "d MMM");
      }
    },
    fetchFinance() {
      this.$store.dispatch(
        "stats/fetchFinance",
        this.currentPeriodType.replace(/last_(.*)/, "$1")
      );
    }
  },
  watch: {
    currentPeriodType() {
      this.fetchFinance();
    }
  },
  mounted() {
    this.fetchFinance();
  }
};
</script>
