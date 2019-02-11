export default {
  methods: {
    fieldError(name) {
      return this.errors.first(name);
    }
  }
};
