<template>
	<div>
    <Header v-if="user"/>
		<main id="content">
			<router-view></router-view>
		</main>
    <Sidebar/>
    <Toast v-if="showToast" @hide="showToast = false" />
	</div>
</template>

<script>
import Header from "./components/header/Index";
import Sidebar from "./components/Sidebar";
import Toast from "./components/common/Toast";
import ColorScheme from "@/mixins/colorScheme";

export default {
  components: {
    Header,
    Sidebar,
    Toast
  },
  mixins: [ColorScheme],
  data() {
    return {
      showToast: false
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    toastShowTrigger() {
      return this.$store.state.global.toastShowTrigger;
    }
  },
  watch: {
    toastShowTrigger() {
      this.showToast = true;
    }
  }
};
</script>

<style lang="scss" src="@/design/css/main.scss">
</style>
<style lang="scss" src="@/design/css/colorScheme.scss">
</style>
<style lang="scss" src="@/design/fonts/team/team.scss">
</style>
