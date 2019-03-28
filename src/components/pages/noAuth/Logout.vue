<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    console.log("Logout page mounted");
    this.$store.dispatch("auth/logout").then(() => {
      this.$router.push("/login");
    });
  }
};
</script>
