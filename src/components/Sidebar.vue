<template>
    <div class="sidebar">
        <div class="sidebar__scroller">
            <router-link to="/alexeionline" class="avatar header-avatar"><img src="https://media.team2.retloko.com/files/f/fu/fuv/fuvehoth2zqjgua11c8akpdcxgr3dvvw1537170622/2afff3a23099780908097f84bc5da2fd_normal.jpeg"></router-link>
            <div class="sidebar__inside">
                <span role="button" class="user-menu-close"></span>
                <div class="sidebar__header">
                    <div class="user-group-info">
                        <div class="user-menu-name">
                            <router-link to="/alexeionline" class="name">alexeionline</router-link>
                            <span class="verified-user"></span>
                        </div>
                        <div class="user-menu-login user-login">
                            <router-link to="/alexeionline">alexeionline</router-link>
                        </div>
                    </div>
                    <div class="user-menu-counts">
                        <router-link to="/following" class="user-menu-counts-item">
                            <span class="user-menu-counts-item-count" id="sidebarFollowing">0</span> <span class="user-menu-counts-item-title">Following</span>
                        </router-link>
                        <router-link to="/followers" class="user-menu-counts-item">
                            <span class="user-menu-counts-item-count" id="sidebarFollowers">1</span> <span class="user-menu-counts-item-title">Followers</span>
                        </router-link>
                    </div>
                </div>
                <div class="sidebar-menu">
                    <nav class="user-menu">
                        <div class="user-menu__col">
                            <router-link class="user-menu-item user-menu-item__profile" to="/alexeionline">Profile</router-link>
                            <!--
                        <router-link class="user-menu-item user-menu-item__statistics" to="/statistics">Statistics</router-link>
                        -->
                            <router-link class="user-menu-item user-menu-item__payouts" to="/settings/payouts">Payouts</router-link>
                            <router-link class="user-menu-item user-menu-item__payments" to="/settings/payments">Payments</router-link>
                        </div>
                        <div class="user-menu__col">
                            <router-link class="user-menu-item user-menu-item__privacy" to="/settings">Settings and Privacy</router-link>
                            <router-link class="user-menu-item user-menu-item__help" to="/contact">Help</router-link>
                            <router-link class="user-menu-item user-menu-item__logout" to="/logout">Log out</router-link>
                        </div>
                    </nav>
                    <div class="user-menu-bottom-btns">
                        <span role="button" class="user-menu-bottom-btn user-menu-bottom-btn__skin-toggle "></span>
                        <!-- QR temporary hidden -->
                        <!--<span role="button" class="user-menu-bottom-btn user-menu-bottom-btn__qr"></span>-->
                        <span role="button" data-clipboard-text="/alexeionline" data-title="alexeionline" class="user-menu-bottom-btn user-menu-bottom-btn__share"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Sidebar'
    }
</script>


