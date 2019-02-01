export default {
  methods: {
    add(a, b) {
      return a + b;
    },
    calcCount(statData, subKey) {
      let values = Object.values(statData);
      if (subKey) {
        values = values.map(v => v[subKey]);
      }
      return values.reduce(this.add, 0);
    }
  }
};
