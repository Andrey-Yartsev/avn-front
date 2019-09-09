<template>
  <div class="gender-wrapper" :class="{ opened: opened }">
    <div class="selected-option" @click="open">
      <button class="btn-gender b-search-form__btn_mob"
        :class="{ selected: opened }"
      >
        <span class="icn-item icn-gender" :class="selectedOption.name" />
        <span v-if="$mq === 'desktop'">{{ selectedOption.title }}</span>
      </button>
    </div>
    <div class="gender-bar" v-click-outside="close">
      <button
        v-for="v in options"
        :key="v.name"
        :class="{ selected: v.selected }"
        @click="select(v.id)"
        class="btn-gender"
      >
        <span class="icn-item icn-gender" :class="v.cls" />
        <span class="btn-gender__text">{{ v.title }}</span>
      </button>
      <span class="triangle" v-if="$mq === 'desktop'" />
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import User from "@/mixins/user";

const options = [
  {
    name: "everyone",
    title: "Everyone",
    id: 1
  },
  {
    name: "hetero",
    title: "Straight",
    id: 2
  },
  {
    name: "gay",
    title: "Gay Guys",
    id: 3
  },
  {
    name: "trans",
    title: "Trans",
    id: 4
  }
];

export default {
  name: "GenderFilter",
  directives: {
    ClickOutside
  },
  mixins: [User],
  data() {
    return {
      opened: false
    };
  },
  computed: {
    selected() {
      return this.$store.state.explore.gender.category;
    },
    options() {
      return options.map(v => {
        v.selected = this.selected === v.id;
        v.cls = {};
        v.cls[v.name] = true;
        return v;
      });
    },
    selectedOption() {
      return this.options.find(v => v.id === this.selected);
    }
  },
  methods: {
    open() {
      setTimeout(() => {
        this.opened = true;
      }, 10);
    },
    close() {
      this.opened = false;
    },
    select(id) {
      if (this.user) {
        const user = { ...this.$store.state.auth.user };
        user.categoryView = id;
        this.$store.dispatch("profile/updateSilent", user);
        this.$store.commit("explore/gender/setCategory", id);
      } else {
        this.$store.dispatch("explore/gender/setGuestCategory", id);
      }
      this.close();
    }
  }
};
</script>
