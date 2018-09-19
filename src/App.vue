<template>
	<div>
		<Header></Header>
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
			'Header': Header,
			'Sidebar': Sidebar,
		}
	}
</script>

<style lang="scss" src="@/design/css/main.scss"></style>
<style lang="scss" src="@/design/css/colorScheme.scss"></style>
<style lang="scss" src="@/design/fonts/team/team.scss"></style>

