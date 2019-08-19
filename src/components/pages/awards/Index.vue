<template>
  <div class="container">
    <div class="awards-header">
      ddd
      <img src="/static/img/avnawards.png" alt="" />
    </div>
    <div class="awards-title text-centered">
      Pre-Nomination Form
    </div>
    <div class="title-subtext semi-transparent text-centered">
      these are instructions
    </div>
    <div class="loader-container" v-if="loading">
      <Loader text="" :fullscreen="false" :small="true" />
    </div>
    <div v-else-if="sent" class="input-status">
      {{ successText }}
    </div>
    <form action="#" class="awards-form" @submit.prevent="send" v-else>
      <template v-if="predefined">
        <h3>Autofilled categories</h3>
        <Columns
          :categories="categories[0]"
          :value="modelUser.name"
          class="underscore"
          :disabled="true"
        />
        <h3>Choose by yourself</h3>
      </template>

      <Columns :categories="categories[1]" @input="input" />

      <div class="awards__btn-row">
        <button class="btn alt border lg" :disabled="sending || !canSend">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Footer from "@/components/footer/Index.vue";
import Loader from "@/components/common/Loader";
import UserSearchField from "./UserSearchField";
import Columns from "./Columns";
import User from "@/mixins/user";

export default {
  name: "AvnAwards",
  mixins: [User],
  components: {
    Footer,
    Loader,
    UserSearchField,
    Columns
  },
  data() {
    return {
      data: {}
    };
  },
  computed: {
    categories() {
      if (!this.predefined) {
        return [null, this.rearrangeByCols(this._categories)];
      }

      let a = this._categories.filter(v => {
        return this.autofilledCatIds.indexOf(v.id) !== -1;
      });
      let b = this._categories.filter(v => {
        return this.autofilledCatIds.indexOf(v.id) === -1;
      });
      if (a.length) {
        a = this.rearrangeByCols(a);
      }
      if (b.length) {
        b = this.rearrangeByCols(b);
      }
      return [a, b];
    },
    _categories() {
      if (!this.$store.state.awards.categories) {
        return [];
      }
      const cat = this.$store.state.awards.categories;
      return cat.data;
    },
    autofilledCatIds() {
      return this.$route.params.categories.split(",").map(v => {
        return parseInt(v);
      });
    },
    isGay() {
      if (this.predefined) {
        return this.$route.params.type !== "avn_awards";
      }
      return this.$route.meta.isGay;
    },
    predefined() {
      return !!this.$route.meta.predefined;
    },
    eventId() {
      return this.isGay ? 92 : 91;
    },
    loading() {
      if (!this.predefined) {
        return this.$store.state.awards.fetchCategoriesLoading;
      }
      return (
        this.$store.state.awards.fetchCategoriesLoading ||
        this.$store.state.awards.fetchUserLoading
      );
    },
    canSend() {
      return true;
    },
    sending() {
      return this.$store.state.awards.nominateLoading;
    },
    sent() {
      return this.$store.state.awards.nominateSuccess;
    },
    modelUsername() {
      return this.$route.params.username;
    },
    modelUser() {
      return this.$store.state.awards.fetchUserResult;
    },
    successText() {
      return "Your voting have been sent successfully";
    }
  },
  watch: {
    loading(loading) {
      if (this.predefined && !loading) {
        if (!this.categories[0].length) {
          this.$router.push("/not-found");
        }
      }
    }
  },
  methods: {
    input(v) {
      const o = {};
      o[v.id] = v.value;
      this.data = { ...this.data, ...o };
    },
    send() {
      this.$store
        .dispatch("awards/nominate", {
          eventId: this.eventId,
          data: this.data
        })
        .then(() => {
          if (this.predefined && this.sent) {
            this.$router.push("/" + this.$route.params.username);
            this.$store.dispatch("global/flashToast", {
              text: this.successText
            });
            this.$store.dispatch("awards/nominateReset");
          }
        });
    },
    rearrangeByCols(items) {
      const columns = [[], [], []];
      let col = 0;
      for (let i = 0; i < items.length; i++) {
        columns[col].push(items[i]);
        col++;
        if (col % 3 === 0) {
          col = 0;
        }
      }
      return columns;
    },
    setPredefinedData() {
      const autofilledCats = this._categories.filter(v => {
        return this.autofilledCatIds.indexOf(v.id) !== -1;
      });
      autofilledCats.forEach(cat => {
        const o = {};
        o[cat.id] = this.modelUser.name;
        this.data = { ...this.data, ...o };
      });
    }
  },
  created() {
    if (!this.user) {
      this.$store.dispatch("modal/show", {
        name: "login",
        data: {
          disableClose: true,
          disableFooter: true
        }
      });
    }

    this.$store.dispatch("awards/fetchCategories", this.eventId).then(() => {
      if (this.predefined) {
        this.$store
          .dispatch("awards/fetchUser", this.modelUsername)
          .then(() => {
            this.setPredefinedData();
          })
          .catch(() => {
            this.$router.push("/not-found");
          });
      }
    });
  }
};
</script>
