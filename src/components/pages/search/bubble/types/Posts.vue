<template>
  <div class="SearchResultsPopupView">
    <a
      class="user"
      v-for="v in items"
      v-bind:key="v.id"
    >
      <div class="username-group">
        <div class="user__name">
          <a
            @click.prevent="goTo(v.id)"
            :href="'/post/' + v.id" class="name">{{ cut(v) }}</a>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    }
  },
  methods: {
    goTo(id) {
      this.$router.push("/post/" + id);
      this.$emit("away");
    },
    cut(v) {
      if (!v.text) {
        return "…";
      }
      if (v.text.length <= 30) {
        return v.text;
      }
      return v.text.substring(0, 30) + "…";
    }
  }
};
</script>
