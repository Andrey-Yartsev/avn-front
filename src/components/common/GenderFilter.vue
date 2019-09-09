<template>
  <div class="gender-wrapper">
    <div class="selected-option" @click="open">
      <button
        class="btn-gender b-search-form__btn_mob icn-item icn-gender"
        :class="selectedOption.name"
      ></button>
      <span v-if="$mq === 'desktop'">{{ selectedOption.title }}</span>
    </div>
    <div class="gender-bar" v-if="opened" v-click-outside="close">
      <div
        v-for="v in options"
        :key="v.name"
        :class="{ selected: v.selected }"
        @click="select(v.id)"
      >
        <button
          class="btn-gender b-search-form__btn_mob icn-item icn-gender"
          :class="v.cls"
        ></button
        ><span>{{ v.title }}</span>
      </div>
      <span class="triangle"></span>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

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
  data() {
    return {
      opened: false
    };
  },
  computed: {
    selected() {
      return this.$store.state.auth.user.categoryView;
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
      const user = { ...this.$store.state.auth.user };
      user.categoryView = id;
      this.$store.dispatch("profile/updateSilent", user);
      this.close();
    }
  }
};
</script>
