export default {
  computed: {
    isFormValid() {
      return Object.keys(this.fields).some(key => this.fields[key].valid);
    }
  },
  methods: {
    fieldError(name) {
      return this.errors.first(name);
    }
  }
};
