const isFloat = n => {
  return Number(n) === n && n % 1 !== 0;
};

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
      const r = values.reduce(this.add, 0);
      if (isFloat(r)) {
        return Number(r.toFixed(2));
      }
      return r;
    }
  }
};
