<template>
  <div class="container">
    <div class="awards-header">
      <img src="/static/img/avnawards.png" alt="" />
    </div>
    <div class="awards-title text-centered">
      Pre-Nomination Form
    </div>
    <div class="title-subtext semi-transparent text-centered">
      these are instructions
    </div>
    <div class="loader-container" v-if="loading || true">
      <Loader text="" :fullscreen="false" :small="true" />
    </div>
    <div v-else-if="sent" class="input-status">
      Your voting have been sent successfully
    </div>
    <form action="#" class="awards-form" @submit.prevent="send" v-else>
      <div class="row awards">
        <div class="awards__col" v-for="(col, i) in categories" :key="i">
          <label
            class="form-group form-group_row-md"
            v-for="v in col"
            :key="v.id"
          >
            <span class="label label_row">{{ v.title }}</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                <UserSearchField
                  type="text"
                  :placeholder="v.title"
                  v-model="data[v.id]"
                />
              </span>
            </span>
          </label>
        </div>
      </div>
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

export default {
  name: "AvnAwards",
  components: {
    Footer,
    Loader,
    UserSearchField
  },
  data() {
    return {
      data: {}
    };
  },
  computed: {
    categories() {
      if (!this.$store.state.awards.categories) {
        return [];
      }
      const cat = this.$store.state.awards.categories;
      const items = cat.data;
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
    isGay() {
      return this.$route.meta.isGay;
    },
    eventId() {
      return this.isGay ? 92 : 91;
    },
    loading() {
      return this.$store.state.awards.fetchCategoriesLoading;
    },
    canSend() {
      return !!Object.values(this.data).filter(v => !!v).length;
    },
    sending() {
      return this.$store.state.awards.nominateLoading;
    },
    sent() {
      return this.$store.state.awards.nominateSuccess;
    }
  },
  methods: {
    send() {
      this.$store.dispatch("awards/nominate", {
        eventId: this.eventId,
        data: this.data
      });
    }
  },
  created() {
    this.$store.dispatch("awards/fetchCategories", this.eventId);
  }
};
</script>
