<template>
  <Loader v-if="scriptsLoading" :fullscreen="false" :inline="true" />
  <PageInner v-else />
</template>

<script>
import Loader from "@/components/common/Loader";
import PageInner from "./PageInner";
import LoadScripts from "./loadScripts";

export default {
  mixins: [LoadScripts],
  components: {
    Loader,
    PageInner
  }
};
</script>
