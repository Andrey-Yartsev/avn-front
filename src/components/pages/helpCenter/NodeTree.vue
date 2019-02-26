<template>
  <li class="node-tree">
    <!--
    description: "<p>Learn the basics to help you make the most of AVN Stars</p> <p>Learn the basics to help you make the most of AVN Stars</p> <p>Learn the basics to help you make the most of AVN Stars</p> <p>Learn the basics to help you make the most of AVN Stars</p> <p>Learn the basics to help you make the most of AVN Stars</p>"
    icon: "using"
    id: 1
    items: Array[7]
    shortDescription: "Learn the basics to help you make the most of OnMyTeam.com"
    title: "Using A
    -->
    <router-link :to="'/support/article/' + node.id" class="label">{{
      node.title
    }}</router-link>

    <ul v-if="node.items && node.items.length" :class="'level-' + level">
      <node
        v-for="child in node.items"
        :node="child"
        :key="child.id"
        :level="level + 1"
      />
    </ul>
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
  }
};
</script>
