<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("auth/logout").then(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const returnPath = urlParams.get("return_path");
      if (returnPath) {
        this.$router.push("/" + returnPath);
        return;
      }
      this.$router.push("/explore");
    });
  }
};
</script>
