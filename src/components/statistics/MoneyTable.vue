<template>
  <table>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>3</td>
      <td>4</td>
      <td>5</td>
    </tr>
  </table>
</template>

<script>
import moment from "moment";

const add = (a, b) => {
  return a + b;
};

export default {
  name: "statistics-money-table",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    lastMonths() {
      console.log(this.data);
      console.log(moment().month());
      console.log(
        moment()
          .subtract(1, "month")
          .month()
      );
    },
    calc() {
      if (!this.data || !this.data.paid_chat_messages) {
        return;
      }
      // console.log(this.data.paid_chat_messages);
      const values = Object.values(this.data.paid_chat_messages.statData).map(
        v => v.total
      );
      //const values = .map(v => v.total);
      console.log("!");
      console.log(values.reduce(add, 0));
    }
  },
  watch: {
    data: {
      immediate: true,
      handler() {
        this.calc();
      }
    }
  },
  created() {
    this.calc();
  }
};
</script>
