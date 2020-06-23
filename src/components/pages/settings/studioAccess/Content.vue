<template>
  <div class="">
    <h1 class="form-title settings-title">
      Studio Access
    </h1>
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
                <router-link :to="'/' + user.username" class="userview-block">
                  <span class="avatar avatar_sm">
                    <span class="avatar__img">
                      <img :src="user.avatar" v-if="user.avatar" />
                    </span>
                  </span>
                  <div class="name">{{ user.name }}</div>
                  <span class="user-login reset-ml">{{ user.username }}</span>
                </router-link>
              </div>
              <div
                class="btn login_colored login-button"
                @click="login(user.id)"
              >
                Log in
              </div>
            </div>
          </div>
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
import BackRouter from "@/utils/backRouter";
import IntersectionObserver from "@/mixins/intersectionObserver";
// import mockData from "@/mock/studioAccess";

export default {
  name: "StudioAccessContent",
  mixins: [UserMixin, IntersectionObserver],
  components: {
    Loader
  },

  data: () => ({
    loadingName: "studioAccessRequestLoading",
    filter: "",
    fetchLimit: 15
  }),
  computed: {
    // loading() {
    //   return this.$store.state.studioAccess.studioAccessRequestLoading;
    // },
    allDataRecieved() {
      return this.$store.state.studioAccess.allDataReceived;
    },
    profile() {
      return this.user;
    },
    users() {
      // return [...mockData.list];
      return this.$store.state.studioAccess.posts;
    },
    listLength() {
      return this.users.length;
    },
    store() {
      return this.$store.state.studioAccess;
    }
  },
  methods: {
    init() {
      this.destroyObserver();
      this.isInitFetch = true;
      this.$store.commit("studioAccess/reset");
      this.getPosts();
    },
    getPosts() {
      this.$store.dispatch("studioAccess/getUsers").then(() => {
        this.isInitFetch = false;
        this.handleResponseWithIntersectionObserver(this.getPosts);
      });
    },
    goBack() {
      BackRouter.back();
    },
    login(userId) {
      this.$store.dispatch("studioAccess/login", userId).then(() => {
        if (this.$route.path !== "/settings") {
          this.$router.push("/settings");
        }
        setTimeout(() => {
          document.location.reload();
        }, 100);
      });
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
