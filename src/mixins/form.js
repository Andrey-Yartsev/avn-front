export default {
  methods: {
    fieldError(name) {
      return this.errors.first(name);
    }
  },
  computed: {
    isFormValid() {
      return Object.keys(this.fields).every(key => this.fields[key].valid);
    }
  }
};
