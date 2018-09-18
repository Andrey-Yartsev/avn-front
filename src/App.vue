<template>
	<div>
		<Header></Header>
		<main id="content">
			<router-view></router-view>
		</main>
	</div>
</template>

<script>
	import Header from './components/Header';

	export default {
		components: {
			'Header': Header,
		}
	}
</script>

<style lang="scss" src="@/design/css/main.scss"></style>
<style lang="scss" src="@/design/css/colorScheme.scss"></style>
<style lang="scss" src="@/design/fonts/team/team.scss"></style>

