export default {
  data() {
    return {
      localUser: null
    };
  },

  created: function() {
    this.localUser = this._clone(this.$store.state.auth.user);
  },

  watch: {
    user(user) {
      this.localUser = this._clone(user);
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    changed() {
      return JSON.stringify(this.user) !== JSON.stringify(this.localUser);
    },
    loading() {
      return this.$store.state.profile.loading;
    }
  },

  methods: {
    save() {
      this.$store.dispatch("profile/update", this.localUser);
    },
    _clone(o) {
      return JSON.parse(JSON.stringify(o));
    }
  }
};
