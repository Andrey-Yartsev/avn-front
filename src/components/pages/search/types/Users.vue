<template>
  <div class="users">
    <User class="userView" v-for="v in items" v-bind:key="v.id" :v="v" />
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
