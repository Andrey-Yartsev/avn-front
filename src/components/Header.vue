<template>
    <header id="site_header" class="">
        <div class="header-wrapper">
            <div class="container header_container">
                <nav class="header-nav hidden-mobile">
                    <router-link class="menu-item-home" to="/" exact><span>Home</span></router-link>
                    <router-link class="menu-item-explore" to="/explore"><span>Explore</span></router-link>
                    <router-link class="menu-item-notifications hidden-mobile btn-notifications" to="/notifications"><span>Notifications</span></router-link>
                    <router-link class="menu-item-notifications hidden-desktop" to="/notifications"><span>Notifications</span></router-link>
                    <router-link class="menu-item-messages showChat hidden-mobile" to="/chat"><span>Messages</span></router-link>
                    <router-link class="menu-item-messages hidden-desktop" to="/chat"><span>Messages</span></router-link>
                </nav>
                <h1 class="header-logo">
                    <router-link to="/">
                        <img src="/design/img/logo-full.svg">
                        <img class="white-logo" src="/design/img/logo-full-white.svg">
                    </router-link>
                </h1>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        name: 'Header'
    }
</script>
