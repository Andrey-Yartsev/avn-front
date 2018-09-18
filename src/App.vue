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
