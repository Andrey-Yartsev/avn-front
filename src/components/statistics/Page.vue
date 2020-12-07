<template>
  <Loader v-if="scriptsLoading" :fullscreen="false" :inline="true" />
  <PageInner v-else />
</template>

<script>
import Loader from "@/components/common/Loader";
import PageInner from "./PageInner";
import LoadScriptsMixin from "@/components/statistics/mixins/loadScripts";

export default {
  mixins: [LoadScriptsMixin],
  components: {
    Loader,
    PageInner
  }
};
</script>
