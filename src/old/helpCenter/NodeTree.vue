<template>
  <li class="node-tree">
    <a
      @click.prevent="nodeClick"
      :href="'/help/article/' + node.id"
      class="label"
      :class="{ selected: selectedLink }"
    >
      {{ node.title }}</a
    >
    <!--<template v-if="node.items && node.items.length">-->
    <!--<template v-if="level === 2 || level === 3">-->
    <!--<div class="scrollbar" :class="divClass">-->
    <!--<VuePerfectScrollbar v-if="divClass.show">-->
    <!--<ul>-->
    <!--<node-->
    <!--v-for="child in node.items"-->
    <!--:node="child"-->
    <!--:key="child.id"-->
    <!--:level="level + 1"-->
    <!--:click="click"-->
    <!--/>-->
    <!--</ul>-->
    <!--</VuePerfectScrollbar>-->
    <!--</div>-->
    <!--</template>-->
    <!--<template v-else>-->
    <!--<button class="btn-back-list" @click="back"></button>-->
    <!--<div class="scrollbar" :class="divClass">-->
    <!--<VuePerfectScrollbar :settings="{ suppressScrollX: true }">-->
    <!--<ul>-->
    <!--<node-->
    <!--v-for="child in node.items"-->
    <!--:node="child"-->
    <!--:key="child.id"-->
    <!--:level="level + 1"-->
    <!--:click="click"-->
    <!--/>-->
    <!--</ul>-->
    <!--</VuePerfectScrollbar>-->
    <!--</div>-->
    <!--</template>-->
    <!--</template>-->
  </li>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "node",
  props: {
    node: Object,
    selectedRootId: Number,
    level: {
      type: Number,
      default: 1
    },
    click: Function
  },
  components: {
    VuePerfectScrollbar
  },
  methods: {
    nodeClick() {
      this.click({
        level: this.level,
        id: this.node.id
      });
    },
    back() {
      this.$store.dispatch("support/menu/back").then(() => {
        if (this.allClosed) {
          this.selectedRootNodeId = false;
        }
      });
    }
  },
  computed: {
    selected() {
      return this.selectedRootId === this.node.id;
    },
    selectedId() {
      return parseInt(this.$route.params.id);
    },
    selectedLink() {
      if (this.level < 4) {
        return false;
      }
      return this.node.id === this.selectedId;
    },
    allClosed() {
      return (
        !this.$store.state.support.menu.level1Opened &&
        !this.$store.state.support.menu.level2Opened
      );
    },
    level2Opened() {
      return this.$store.state.support.menu.level2Opened;
    },
    level3Opened() {
      return this.$store.state.support.menu.level3Opened;
    },
    divClass() {
      const r = {};
      r["level-" + this.level] = true;
      if (this.level === 1 && this.selected) {
        if (this.level3Opened) {
          r.mlm200 = true;
        } else if (this.level2Opened) {
          r.mlm100 = true;
        }
      }
      if (
        this.level === 2 &&
        this.level2Opened &&
        this.node.id === this.level2Opened
      ) {
        r.show = true;
      }
      if (
        this.level === 3 &&
        this.level3Opened &&
        this.node.id === this.level3Opened
      ) {
        r.show = true;
      }
      return r;
    },
    debugInfo() {
      return (
        "Node=" +
        this.node.id +
        ") " +
        this.node.title +
        ", Level=" +
        this.level
      );
    }
  }
};
</script>

<style>
.debug {
  background: #31708f;
  color: #fff;

  top: 2px;
  left: 2px;
  padding: 2px 6px;
  font-size: 8px;
}
ul {
  position: relative;
}
</style>
