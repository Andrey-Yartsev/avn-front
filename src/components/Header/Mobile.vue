<template>
    <nav class="header-nav hidden-desktop">
        <router-link class="menu-item-home" to="/"><span>Home</span></router-link>
        <router-link class="menu-item-explore" to="/explore"><span>Explore</span></router-link>
        <router-link class="menu-item-notifications hidden-mobile btn-notifications unread" to="/notifications"><span>Notifications</span></router-link>
        <router-link class="menu-item-notifications hidden-desktop unread" to="/notifications"><span>Notifications</span></router-link>
        <router-link class="menu-item-messages showChat hidden-mobile" to="/chat"><span>Messages</span></router-link>
        <router-link class="menu-item-messages hidden-desktop" to="/chat"><span>Messages</span></router-link>
    </nav>
</template>

<script>
    export default {
        name: 'HeaderMobile',
    }
</script>
