<template>
  <div
    class="container-popup NotificationsCollectionView"
    :class="{ 'no-notifications': !items.length && !loading }"
  >
    <div class="notifications-header main-header" v-if="$mq === 'mobile'">
      <div class="header_container">
        <User />
        <h1 class="page-title">Notifications</h1>
        <router-link
          class="btn-settings icn-item icn-size_lg"
          to="/settings/notifications"
        />
      </div>
    </div>

    <MobileHeader v-if="$mq === 'mobile'" />

    <router-link
      class="addPost-btn-float hidden-desktop icn-item icn-post icn-size_lg icn-pos_center"
      to="/addPost"
      v-if="$mq === 'mobile'"
    />

    <div class="popup-container-scroll notifications-container">
      <div class="notifications-filter">
        <div class="notificationsFilterList">
          <a
            v-for="v in menu"
            v-bind:key="v.name"
            :class="{ [v.name]: true, active: v.active }"
            :href="'/notification/' + v.name"
            :data-type="v.name"
            @click.prevent="goTo('/notifications/' + v.name)"
            class="notifications-filter__btn icn-item icn-size_lg"
            ><span
              class="notifications-filter__btn-text"
              v-if="$mq === 'desktop'"
              >{{ v.title }}</span
            ></a
          >
        </div>
        <router-link
          class="notifications-filter__btn btn-settings hidden-mobile icn-item icn-size_lg"
          to="/settings/notifications"
          v-if="$mq === 'desktop'"
        />
      </div>
      <div
        class="new-post-toast bg-gradient bg-gradient_standart show unread-box"
        v-if="unreadCount"
      >
        <span>Unread ({{ unreadCount > 100 ? "+99" : unreadCount }})</span>
        <a href="#" @click.prevent="markAllAsRead">Mark All as Read</a>
      </div>
      <component
        :is="notificationView"
        :items="items"
        :scrollFunction="scrollFunction"
        :loading="loading"
      />
      <div
        class="msg-no-content"
        v-if="!items.length && !loading"
        :class="{ show: !loading }"
      >
        <div class="msg-no-content__text">
          Nothing happened yet
        </div>
      </div>
    </div>
    <Footer
      class="site-footer_main"
      v-if="$mq === 'mobile' || mode !== 'modal'"
    />
  </div>
</template>

<script>
import ModalRouterParams from "@/mixins/modalRouter/params";
import MobileHeader from "@/components/header/Mobile";
import UserMixin from "@/mixins/user";
import Footer from "@/components/footer/Index.vue";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import NotificationSingleView from "./Items/Single";
import NotificationMergedView from "./Items/Merged";
import User from "@/components/header/User";
import uniqBy from "lodash.uniqby";
import { fromNow } from "@/helpers/datetime";

const typeTitles = {
  all: "Notifications",
  favorited: "Favorited",
  commented: "Comments",
  mentioned: "Mentions",
  followed: "Followers",
  tip: "Tips",
  subscribed: "Subscriptions"
  // system: "System"
};

export default {
  name: "Notifications",

  mixins: [ModalRouterParams, UserMixin, InfinityScrollMixin],

  components: {
    NotificationMergedView,
    NotificationSingleView,
    MobileHeader,
    Footer,
    User
  },

  computed: {
    loadingName() {
      return "fetchLoading";
    },
    store() {
      return this.$store.state.notif;
    },
    posts() {
      return this.$store.state.notif.posts;
    },
    type() {
      return this.routeParams.type || "all";
    },
    loading() {
      return this.$store.state.notif.fetchLoading;
    },
    allDataReceived() {
      return this.$store.state.notif.allDataReceived;
    },
    items() {
      if (this.type === "all") {
        const merged = this.posts.reduce((m, v, index) => {
          const time = fromNow(v.createdAt);

          //first item
          if (index === 0) {
            return [
              {
                id: index,
                type: v.type,
                items: [v],
                mergedByName: false,
                time
              }
            ];
          }

          const prevItem = m[m.length - 1];
          if (
            v.type === prevItem.type &&
            v.type !== "tip" &&
            v.type !== "mentioned" &&
            v.type !== "subscribed" &&
            prevItem.time === time
          ) {
            prevItem.mergedByName =
              v.user.id === prevItem.items[prevItem.items.length - 1].user.id;
            prevItem.items.push(v);
            return [...m];
          }

          return [
            ...m,
            {
              mergedByName: false,
              type: v.type,
              items: [v],
              id: index,
              time
            }
          ];
        }, []);

        return merged.map(i =>
          i.mergedByName
            ? i
            : { ...i, items: uniqBy(i.items, item => item.user.id) }
        );
      }

      return this.posts.map((v, index) => ({
        ...v,
        id: index
      }));
    },
    menu() {
      const menuTitles = Object.entries(typeTitles).map(v => {
        return {
          active: this.type === v[0],
          name: v[0],
          title: v[1]
        };
      });

      return this.$root.showTips
        ? menuTitles
        : menuTitles.filter(a => a.name !== "tip");
    },
    notificationView() {
      return this.type === "all"
        ? NotificationMergedView
        : NotificationSingleView;
    },
    unreadCount() {
      return this.$store.state.notif.unreadCount;
    }
  },

  methods: {
    infinityScrollGetDataMethod() {
      this.$store.dispatch("notif/getPosts", { type: this.type });
    },
    scrollFunction(e) {
      const { scrollHeight, scrollTop, offsetHeight } = e.srcElement;
      const scrolledEnought = scrollHeight - (offsetHeight + scrollTop) < 100;

      if (scrolledEnought && !this.loading && !this.allDataReceived) {
        this.infinityScrollGetDataMethod();
      }
    },
    initPostModals() {},
    markAllAsRead() {
      this.$store.dispatch("notif/markAllAsRead");
    }
  },

  watch: {
    type() {
      this.$store.commit("notif/reset");
      this.lastYOffset = 0;
      this.$store.dispatch("notif/getPosts", { type: this.type });
    }
  },

  created() {
    this.$store.commit("notif/reset");
    this.$store.dispatch("notif/getPosts", { type: this.type }).then(() => {
      this.initPostModals();
    });
  }
};
</script>
