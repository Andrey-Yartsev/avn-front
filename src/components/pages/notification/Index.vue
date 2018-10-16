<template>
  <div class="NotificationsCollectionView" :class="{'no-notifications':!items.length}">

    <div class="notifications-header">
      <div class="header_container">
        <a href="/ddddd" class="avatar header-avatar"></a>
        <h1 class="page-title">Notifications</h1>
        <a class="btn-settings" href="/settings/notifications"></a>
      </div>
    </div>

    <nav class="header-nav hidden-desktop"><a class="menu-item-home homePage" href="/"><span>Home</span></a>
      <a class="menu-item-explore" href="/explore"><span>Explore</span></a>
      <a class="menu-item-notifications hidden-mobile btn-notifications active" href="/notifications"><span>Notifications</span></a>
      <a class="menu-item-notifications hidden-desktop active" href="/notifications"><span>Notifications</span></a>
      <a class="menu-item-messages showChat hidden-mobile" href="/chat"><span>Messages</span></a>
      <a class="menu-item-messages hidden-desktop" href="/chat"><span>Messages</span></a>
    </nav>

    <a class="addPost-btn-float hidden-desktop" href="/addPost"></a>

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
        <a class="btn-settings hidden-mobile" href="/settings/notifications"></a>
      </div>

      <div class="notifications">
          <div class="NotificationsView" v-for="v in items" v-bind:key="v.id">
            <div :class="v.type">
              <div class="avatars-wrapper">
                <router-link :to="'/' + v.user.username" class="avatar">
                  <img :src="v.user.avatar" v-if="v.user.avatar"/>
                </router-link>
              </div>
              <span class="timestamp">{{ time(v.createdAt) }}</span>
              <div class="content">
                <router-link :to="'/' + v.user.username" class="name">{{ v.user.name }}</router-link>
                {{ v.type }} your post
              </div>
            </div>
          </div>
      </div>

      <div class="msg-no-content">
        <div class="msg-no-content__text">
          {{ loading ? "Loading..." : "Nothing happened yet" }}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import dateFns from "date-fns";
import { Scrolly, ScrollyViewport, ScrollyBar } from "vue-scrolly";
import ModalRouter from "@/mixins/modalRouter";

const typeTitles = {
  all: "All",
  favorited: "Favorited",
  commented: "Comments",
  mentioned: "Mentions",
  connected: "Followers",
  tip: "Tips",
  price_changed: "Price changes",
  system: "System"
};

export default {
  name: "Notifications",

  mixins: [ModalRouter],

  components: {
    Scrolly,
    ScrollyViewport,
    ScrollyBar
  },

  computed: {
    type() {
      return this._route.params.type || "all";
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
