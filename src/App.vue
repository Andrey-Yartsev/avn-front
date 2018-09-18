<template>
	<div>
		<header id="site_header">
			<div class="header-wrapper">
				<div class="container header_container">
					<nav class="header-nav hidden-mobile">
						<router-link class="menu-item-home active" to="/"><span>Home</span></router-link>
						<router-link class="menu-item-explore" to="/explore"><span>Explore</span></router-link>
						<router-link class="menu-item-notifications hidden-mobile btn-notifications" to="/notifications"><span>Notifications</span></router-link>
						<router-link class="menu-item-notifications hidden-desktop" to="/notifications"><span>Notifications</span></router-link>
						<router-link class="menu-item-messages showChat hidden-mobile" to="/chat"><span>Messages</span></router-link>
						<router-link class="menu-item-messages hidden-desktop" to="/chat"><span>Messages</span></router-link>
					</nav>
					<h1 class="header-logo">
						<router-link to="/">
							<img src="/ver_e2f80f4/design/img/logo-full.svg">
							<img class="white-logo" src="/ver_e2f80f4/design/img/logo-full-white.svg">
						</router-link>
					</h1>
				</div>
			</div>
		</header>
		<router-view></router-view>
	</div>
</template>

<script>
	export default {}
</script>
