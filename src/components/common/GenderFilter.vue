<template>
  <div
    :class="['more-functions gender-wrapper', { open: opened }]"
    v-click-outside="hide"
  >
    <div class="more-functions__overlay" @click="hide" />
    <div class="more-functions__btn btn-gender" @click="open">
      <span class="icn-item icn-gender" :class="selectedOption.name" />
      <span v-if="$mq === 'desktop'" class="btn-gender__text">{{
        selectedOption.title
      }}</span>
    </div>
    <div class="more-functions__dropdown">
      <div class="more-functions__dropdown-inside">
        <ul class="more-functions__list">
          <li
            class="more-functions__item"
            v-for="v in options"
            :key="v.name"
            :class="{ selected: v.selected }"
          >
            <button
              type="button"
              class="more-functions__link btn-gender"
              @click="select(v.id)"
            >
              <span class="icn-item icn-gender" :class="v.cls" />
              <span class="btn-gender__text">{{ v.title }}</span>
            </button>
          </li>
        </ul>
      </div>
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
    toggle() {
      this.opened ? this.close() : this.open();
    },
    close() {
      this.opened = false;
    },
    open() {
      this.opened = true;
      this.$emit("openDropdawn");
    },
    hide() {
      this.opened = false;
      this.$emit("hideDropdawn");
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
