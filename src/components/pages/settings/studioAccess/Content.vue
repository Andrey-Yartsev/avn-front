<template>
  <div class="">
    <h1 class="form-title settings-title">
      Studio Access
    </h1>
    <!-- <div class="SubscribersBlockCollectionView settings-wrapper"> -->
    <div class=" settings-wrapper">
      <div
        class="form-title"
        :class="{
          'table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo':
            $mq === 'desktop'
        }"
      />
      <div class="shadow-block no-padding">
        <div class="table-wrapper">
          <div class="table">
            <div class="item" v-for="(user, i) in users" :key="user.id">
              <div class="index">
                {{ i + 1 }}
              </div>
              <div class="user">
                <router-link
                  :to="'/' + user.subscriber.username"
                  class="userview-block"
                >
                  <span class="avatar avatar_sm">
                    <span class="avatar__img">
                      <img
                        :src="user.subscriber.avatar"
                        v-if="user.subscriber.avatar"
                      />
                    </span>
                  </span>
                  <div class="name">{{ user.subscriber.name }}</div>
                  <span class="user-login reset-ml">{{
                    user.subscriber.username
                  }}</span>
                </router-link>
              </div>
              <div class="btn login_colored login-button">
                Log in
                <!-- <button>Login</button> -->
              </div>
            </div>
          </div>
          <!-- <UsersTable
            v-if="users.length"
            :items="users"
            :loading="false"
            :query="page"
            :actionPrefix="actionPrefix"
          /> -->
          <div class="border-top loader-container" v-if="!allDataRecieved">
            <Loader :fullscreen="false" text="" :small="true" />
          </div>
          <div v-if="users.length" ref="scrollObserver"></div>
          <div
            v-if="!users.length && allDataRecieved"
            class="empty-table-info show"
          >
            <span>Empty here for now</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import UserMixin from "@/mixins/user";
import SubscribeButton from "@/components/subscription/Button";
import UsersTable from "@/components/users/UsersTable.vue";
import ProfileAvatar from "@/components/common/profile/avatar/Index";
import HeaderControl from "@/components/common/profile/headerControl/Index";
import ProfileBackground from "@/components/common/profile/background/Index";
import FollowersCounter from "@/components/common/profile/followersCounter/Index";
import UserDropdown from "@/components/common/userDropdown/Index";
import ProfileActions from "@/components/common/profile/actions/Index";
import Footer from "@/components/footer/Index";
import BackRouter from "@/utils/backRouter";
import IntersectionObserver from "@/mixins/intersectionObserver";

export default {
  name: "StudioAccessContent",
  mixins: [UserMixin, IntersectionObserver],
  components: {
    Loader,
    UsersTable,
    SubscribeButton,
    ProfileAvatar,
    HeaderControl,
    ProfileBackground,
    FollowersCounter,
    UserDropdown,
    ProfileActions,
    Footer
  },

  data: () => ({
    loadingName: "subscribesRequestLoading",
    filter: "",
    actionPrefix: "subscribes",
    isSnapchatOnly: false,
    isActiveOnly: false,
    isExpiredOnly: false,
    fetchLimit: 15
  }),
  computed: {
    loading() {
      return this.$store.state.subscribes.subscribesRequestLoading;
    },
    allDataRecieved() {
      return this.$store.state.subscribes.allDataReceived;
    },
    page() {
      return this.$route.meta.title;
    },
    profile() {
      return this.user;
    },
    users() {
      const isGay = !!window.location.hostname.match(/gayvn/);
      if (isGay) {
        const excepting = ["avnawards", "avnmagazine"];
        return this.$store.state.subscribes.posts.filter(user => {
          return excepting.indexOf(user.username) === -1;
        });
      }
      return this.$store.state.subscribes.posts;
    },
    listLength() {
      return this.users.length;
    },
    store() {
      return this.$store.state.subscribes;
    },
    scrollBarWidth() {
      if (!this.$store.state.global.modalOpened) {
        return 0;
      }
      return this.$store.state.global.scrollBarWidth;
    }
  },
  methods: {
    init() {
      this.destroyObserver();
      this.isInitFetch = true;
      this.$store.commit("subscribes/reset");
      this.getPosts();
    },
    getPosts() {
      if (this.actionPrefix === "subscribes") {
        this.$store
          .dispatch("subscribes/getPosts", {
            active: this.isActiveUsers()
          })
          .then(() => {
            this.isInitFetch = false;
            this.handleResponseWithIntersectionObserver(this.getPosts);
          });
      } else {
        this.$store
          .dispatch("subscribes/getSnapchatPosts", {
            active: this.isActiveUsers()
          })
          .then(() => {
            this.isInitFetch = false;
            this.handleResponseWithIntersectionObserver(this.getPosts);
          });
      }
    },
    isActiveUsers() {
      if (
        (this.isActiveOnly && this.isExpiredOnly) ||
        (!this.isActiveOnly && !this.isExpiredOnly)
      )
        return "";
      if (this.isActiveOnly) return true;
      if (this.isExpiredOnly) return false;
    },
    openGroupMessageModal() {
      this.$store.dispatch("modal/show", {
        name: "groupMessage"
      });
    },
    changeActionPreffix(value) {
      this.actionPrefix = value;
      this.$nextTick(() => {
        this.init();
      });
    },
    goBack() {
      BackRouter.back();
    }
  },
  watch: {
    page() {
      this.init();
    },
    isSnapchatOnly(newValue) {
      if (newValue) {
        this.changeActionPreffix("snapchat");
      } else {
        this.changeActionPreffix("subscribes");
      }
    },
    isActiveOnly() {
      this.init();
    },
    isExpiredOnly() {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.message-button {
  border: 1px solid rgba(128, 128, 128, 0.295);
  padding: 0.3rem 2rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: rgba(128, 128, 128, 0.295);
  }
}
.table {
  margin: 0 20px;
}
.item {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 5px 0;
  /* margin-bottom: 5px; */
}
.index {
  width: 30px;
  padding-bottom: 12px;
}
.userview-block {
  display: block;
}
.login-button {
  margin-left: auto;
  padding: 5px 20px;
  height: auto;
  font-size: 14px;
}
</style>
