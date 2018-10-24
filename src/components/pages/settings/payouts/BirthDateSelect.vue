<template>
  <div>
    <input name="birthDate" value="" id="birthDate" type="hidden">
    <select class="day" name="day" v-model="day" required="required">
      <option :value="v.value" v-for="v in days" v-bind:key="v.value">{{ v.title }}</option>
    </select>
    <select class="month" name="month" v-model="month" required="required">
      <option :value="v.value" v-for="v in months" v-bind:key="v.value">{{ v.title }}</option>
    </select>
    <select class="year" name="year" v-model="year" required="required">
      <option :value="v.value" v-for="v in years" v-bind:key="v.value">{{ v.title }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "BirthDateSelect",

  data() {
    return {
      day: "",
      month: "",
      year: ""
    };
  },

  computed: {
    value() {
      return this.year + "-" + this.month + "-" + this.day;
    },
    days() {
      const days = [
        {
          value: "",
          title: "Day"
        }
      ];
      for (let i = 1; i <= 31; i++) {
        let value = i.toString().padStart(2, "0");
        days.push({
          value,
          title: value
        });
      }
      return days;
    },
    months() {
      const months = [
        {
          value: "",
          title: "Month"
        }
      ];
      months.push({
        value: "01",
        title: "January"
      });
      months.push({
        value: "02",
        title: "February"
      });
      months.push({
        value: "03",
        title: "March"
      });
      months.push({
        value: "04",
        title: "April"
      });
      months.push({
        value: "05",
        title: "May"
      });
      months.push({
        value: "06",
        title: "June"
      });
      months.push({
        value: "07",
        title: "July"
      });
      months.push({
        value: "08",
        title: "August"
      });
      months.push({
        value: "09",
        title: "September"
      });
      months.push({
        value: "10",
        title: "October"
      });
      months.push({
        value: "11",
        title: "November"
      });
      months.push({
        value: "12",
        title: "December"
      });
      return months;
    },
    years() {
      const years = [
        {
          value: "",
          title: "Year"
        }
      ];
      const startYear = new Date().getFullYear() - 18;
      for (let i = startYear; i >= startYear - 103; i--) {
        years.push({
          value: i,
          title: i
        });
      }
      return years;
    }
  },

  watch: {
    value(value) {
      this.$emit("input", value);
    }
  }
};
</script>
