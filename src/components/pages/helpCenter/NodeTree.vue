<template>
  <li class="node-tree">
    <a
      @click.prevent="titleClick(node.id)"
      :href="'/support/article/' + node.id"
      class="label"
      >{{ node.title }}</a
    >

    <template v-if="node.items && node.items.length">
      <template v-if="level === 2 || level === 3">
        <div class="scrollbar" :class="'level-' + level">
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
      <template>
        <ul :class="ulClass1">
          <node
            v-for="child in node.items"
            :node="child"
            :key="child.id"
            :level="level + 1"
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
    level: {
      type: Number,
      default: 1
    }
  },
  methods: {
    titleClick(id) {
      if (this.level === 1) {
        this.$emit("click", id);
      }
    }
  },
  computed: {
    ulClass1() {
      const r = {};
      r["level-" + this.level] = true;
      if (this.level === 1) {
        r.mlm100 = true;
      }
      return r;
    }
  }
};
</script>
