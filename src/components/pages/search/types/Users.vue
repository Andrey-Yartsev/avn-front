<template>
  <div class="explore-wrapper users">
    <User class="userView" v-for="item in items" v-bind:key="item.id" :profile="item" />
  </div>
</template>

<script>
import User from "@/components/common/user/Index";

export default {
  name: "SearchUsers",
  props: ["items"],

  components: {
    User
  }
};
</script>
