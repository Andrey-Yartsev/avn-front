<template>
  <ul class="search-query__list">
    <li class="search-query__item" v-for="v in items" v-bind:key="v">
      <a
        href="#"
        @click.prevent="() => onSelect(v)"
        class="search-query__link"
        >{{ v }}</a
      >
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    },
    onSelect: {
      type: Function
    }
  }
};
</script>
