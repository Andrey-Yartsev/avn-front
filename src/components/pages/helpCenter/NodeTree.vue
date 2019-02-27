<template>
  <li class="node-tree">
    <a
      @click.prevent="nodeClick"
      :href="'/support/article/' + node.id"
      class="label"
      >{{ node.title }}</a
    >

    <template v-if="node.items && node.items.length">
      <template v-if="level === 2 || level === 3">
        <div class="scrollbar" :class="divClass">
          <ul>
            <node
              v-for="child in node.items"
              :node="child"
              :key="child.id"
              :level="level + 1"
            />
          </ul>
        </div>
      </template>
      <template v-else>
        <ul :class="ulClass">
          <node
            v-for="child in node.items"
            :node="child"
            :key="child.id"
            :level="level + 1"
            :click="click"
            :level2Opened="level2Opened"
          />
        </ul>
      </template>
    </template>
  </li>
</template>

<script>
export default {
  name: "node",
  props: {
    node: Object,
    selectedRootId: Number,
    level1Opened: Boolean,
    level2Opened: Boolean,
    level: {
      type: Number,
      default: 1
    },
    click: Function
  },
  methods: {
    nodeClick() {
      this.click({
        level: this.level,
        id: this.node.id
      });
    }
  },
  computed: {
    ulClass() {
      const r = {};
      r["level-" + this.level] = true;
      if (this.level === 1 && this.level2Opened) {
        r.mlm100 = true;
      }
      return r;
    },
    divClass() {
      const r = {};
      r["level-" + this.level] = true;
      if (this.level === 2 && this.level2Opened) {
        r.show = true;
      }
      return r;
    }
  }
};
</script>
