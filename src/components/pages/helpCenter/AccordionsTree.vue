<template>
  <div class="accordion-block">
    <div
      class="accordion-section"
      :class="{ opened: isOpened(v.id) }"
      v-for="v in subSections"
      :key="v.id"
    >
      <div class="accordion-section__title" @click="toggle(v.id)">
        {{ v.title }}
      </div>
      <div class="accordion-section__body">
        <div class="accordion-section__body-inside">
          <div
            v-if="v.description"
            class="support-text"
            v-html="v.description"
          ></div>
          <Rate v-if="user && v.description" :articleId="v.id" />
          <div v-if="hasChildren(v)">
            <AccordionsTree
              v-show="outputChildren"
              :subSections="v.items"
              :level="level + 1"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Rate from "./Rate";
import User from "@/mixins/user";
import AccordionsTree from "./AccordionsTree";

export default {
  name: "AccordionsTree",
  mixins: [User],
  components: {
    Rate,
    AccordionsTree
  },
  props: {
    level: {
      type: Number,
      default: 0
    },
    subSections: Array
  },
  computed: {
    openedId() {
      return this.$store.state.support.accordion.opened[this.level];
    },
    openedSection() {
      return this.subSections.find(v => v.id === this.openedId);
    },
    outputChildren() {
      if (!this.openedSection) {
        return false;
      }
      return this.hasChildren;
    }
  },
  methods: {
    hasChildren(section) {
      if (!section.items || !section.items.length) {
        return false;
      }
      return true;
    },
    open(id) {
      this.$store.commit("support/accordion/open", {
        level: this.level,
        id
      });
    },
    toggle(id) {
      if (!this.isOpened(id)) {
        this.open(id);
      } else {
        this.$store.commit("support/accordion/closeAll", {
          level: this.level
        });
      }
    },
    isOpened(id) {
      return this.openedId === id;
    }
  }
};
</script>
