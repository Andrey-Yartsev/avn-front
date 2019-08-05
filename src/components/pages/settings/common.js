export default {
  data() {
    return {
      localUser: null
    };
  },

  created: function() {
    this.saveHandler = this.save.bind(this);
    this.localUser = this._clone(this.$store.state.auth.user);

    window.addEventListener("saveProfile", this.saveHandler);
  },

  beforeDestroy() {
    window.removeEventListener("saveProfile", this.saveHandler);
  },

  watch: {
    user(user) {
      this.localUser = this._clone(user);
    },
    changed: {
      immediate: true,
      handler(changed) {
        this.$store.commit("profile/setChanged", changed);
      }
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
      if (!this.changed) {
        return;
      }
      this.$store.dispatch("profile/update", this.localUser);
    },
    _clone(o) {
      return JSON.parse(JSON.stringify(o));
    },
    updateProps(props) {
      this.$store
        .dispatch("user/update", {
          ...this.localUser,
          ...props
        })
        .then(r => {
          this.replaceProps(r);
        });
    },
    replaceProps(r) {
      this.$store.dispatch("auth/extendUser", r);
      this.$store.dispatch("profile/home/extend", r);
      this.localUser = { ...this.localUser, ...r };
    }
  }
};
