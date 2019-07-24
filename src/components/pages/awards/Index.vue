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
    {{ data }}
    <form action="#" class="awards-form" @submit.prevent="send">
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
                <input
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
        <button class="btn alt border lg">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import Footer from "@/components/footer/Index.vue";
import cat from "./cat1.json";

export default {
  name: "AvnAwards",
  components: {
    Footer
  },
  data() {
    return {
      data: {}
    };
  },
  computed: {
    categories() {
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
    }
  },

  methods: {
    send() {
      this.$store.dispatch("awards/nominate", {
        eventId: 91,
        data: this.data
      });
    }
  },

  created() {}
};
</script>
