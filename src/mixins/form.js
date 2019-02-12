export default {
  methods: {
    fieldError(name) {
      return this.errors.first(name);
    }
  },
  isFormValid() {
    return Object.keys(this.fields).some(key => this.fields[key].valid);
  }
};
