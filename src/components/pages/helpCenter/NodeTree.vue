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
    <span class="label">{{ node.title }}</span>

    <ul v-if="node.items && node.items.length">
      <node v-for="child in node.items" :node="child" :key="child.id" />
    </ul>
  </li>
</template>

<script>
export default {
  name: "node",
  props: {
    node: Object
  }
};
</script>
