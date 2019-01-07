<template>
  <div class="NotificationsCollectionView" :class="{'no-notifications':!items.length}">

    <div class="notifications-header">
      <div class="header_container">
        <router-link :to="'/' + user.username" class="avatar header-avatar"><span class="avatar__img"></span></router-link>
        <h1 class="page-title">Notifications</h1>
        <router-link class="btn-settings" to="/settings/notifications"></router-link>
      </div>
    </div>

    <MobileHeader />

    <router-link class="addPost-btn-float hidden-desktop" to="/addPost"></router-link>

    <div class="notifications-container">
      <div class="notifications-filter">
        <div class="notificationsFilterList">
          <a
            v-for="v in menu"
            v-bind:key="v.name"
            :class="{[v.name]: true, 'active': v.active}"
            :href="'/notification/' + v.name"
            :data-type="v.name"
            @click.prevent="goTo('/notifications/' + v.name)"
          >{{ v.title }}</a>
        </div>
        <router-link class="btn-settings hidden-mobile" to="/settings/notifications"></router-link>
      </div>
      <VuePerfectScrollbar class="notifications">
        <div
          class="NotificationsView"
          :class="{[v.type]: true, unread: !v.isRead, 'last-child': key === items.length - 1}"
          v-for="(v, key) in items"
          v-bind:key="v.id"
        >
          <div class="avatars-wrapper">
            <router-link :to="'/' + v.user.username" class="avatar avatar_ex-sm">
              <span class="avatar__img">
                <img :src="v.user.avatar" v-if="v.user.avatar"/>
              </span>
            </router-link>
            <span class="timestamp">{{ time(v.createdAt) }}</span>
          </div>
          <div class="content">
            <router-link :to="'/' + v.user.username" class="name">{{ v.user.name }}</router-link>
            {{ v.text }}
          </div>
        </div>
      </VuePerfectScrollbar>
      <div class="msg-no-content">
        <div class="msg-no-content__text">
          {{ loading ? "Loading..." : "Nothing happened yet" }}
        </div>
      </div>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import dateFns from "date-fns";
import ModalRouterParams from "@/mixins/modalRouter/params";
import MobileHeader from "@/components/header/Mobile";
import User from "@/mixins/user";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Footer from "@/components/footer/Index.vue";

const typeTitles = {
  all: "Notifications",
  favorited: "Favorited",
  commented: "Comments",
  mentioned: "Mentions",
  connected: "Followers",
  tip: "Funds",
  price_changed: "Price changes",
  system: "System"
};

export default {
  name: "Notifications",

  mixins: [ModalRouterParams, User],

  components: {
    VuePerfectScrollbar,
    MobileHeader,
    Footer
  },

  computed: {
    type() {
      return this.routeParams.type || "all";
    },
    loading() {
      return this.$store.state.notif.fetchLoading;
    },
    items() {
      let n = 0;
      return this.$store.state.notif.items.map(v => {
        n++;
        v.id = n;
        return v;
      });
    },
    menu() {
      return Object.entries(typeTitles).map(v => {
        return {
          active: this.type === v[0],
          name: v[0],
          title: v[1]
        };
      });
    }
  },

  methods: {
    time(date) {
      return dateFns.distanceInWordsStrict(new Date(), date);
    }
  },

  watch: {
    type() {
      this.$store.dispatch("notif/fetch", this.type);
    }
  },

  created() {
    this.$store.dispatch("notif/fetch", this.type).then(() => {
      this.$store.dispatch("auth/extendUser", { hasNotifications: false });
    });
  }
};
</script>
