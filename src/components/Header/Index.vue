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
                        <img src="https://team2.retloko.com/ver_6667c0c/design/img/logo-full.svg">
                        <img class="white-logo" src="https://team2.retloko.com/ver_6667c0c/design/img/logo-full-white.svg">
                    </router-link>
                </h1>
                <Search></Search>
                <User></User>
                <button class="btn make-post-btn hidden-mobile" type="button">Share</button>
                <a class="btn make-post-btn hidden-desktop" href="/addPost">Share</a>
            </div>
        </div>
    </header>
</template>

<script>
import Search from "./Search";
import User from "./User";

export default {
  name: "Header",
  components: {
    Search: Search,
    User: User
  }
};
</script>
