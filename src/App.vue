<template>
	<div>
    <Header v-if="user"/>
		<main id="content">
			<router-view></router-view>
		</main>
    <Sidebar></Sidebar>
	</div>
</template>

<script>
	import Header from './components/Header/Index';
  import Sidebar from './components/Sidebar';

	export default {
		components: {
						Header, Sidebar
					},
					computed: {
						user() {
							return true
						}
					}
	}
</script>

<style lang="scss" src="@/design/css/main.scss"></style>
<style lang="scss" src="@/design/css/colorScheme.scss"></style>
<style lang="scss" src="@/design/fonts/team/team.scss"></style>

