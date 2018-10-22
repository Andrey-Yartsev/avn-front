<template>
  <div class="userCollectionView">
    <div class="users">
      <div class="userView" v-for="v in items" v-bind:key="v.id">
        <div class="bg"><img v-if="v.header" :src="v.header"/></div>
        <div class="user-container">
          <div class="avatar"><img v-if="v.avatar" :src="v.avatar"/></div>
          <div class="names-actions-wrapper">
            <div class="user-names">
              <div class="wrap-name">
                <router-link :to="'/' + v.username" class="name">{{ v.name }}</router-link>
              </div>
              <span class="user-login">
                <router-link :to="'/' + v.username">{{ v.username }}</router-link>
              </span>
            </div>
            <div class="user-actions">
              <SubscribeButton :profile="v" @requested="data => subsRequested(v.id, data)"/>
              <span class="subscribeView" v-if="!v.subscribedBy">
                <div
                  class="profile-actions__btn btn-subscribe"
                  @click="v.followedBy ? unfollow(v.id) : follow(v.id)"
                >
                  <div class="btn-subscribe__label">
                    {{ v.followedBy ? "Unfollow" : "Follow" }}
                  </div>
                </div>
              </span>
              <div
                class="more-functions hidden-mobile"
                :class="{open: isOptionsOpened(v.id)}"
              >
                <div
                  class="more-functions__btn more-functions__btn_with-text"
                  @click="toggleOptions(v.id)">
                  <div class="more-functions__btn-text">
                    More
                  </div>
                </div>
                <div class="more-functions__dropdown">
                  <div class="more-functions__dropdown-inside">
                    <ul>
                      <li><a href="#" @click.prevent="report(v.id)">Report</a></li>
                      <li v-if="v.isBlocked"><a href="#" @click.prevent="unblock(v.id)">Unblock</a></li>
                      <li v-else><a href="#" @click.prevent="block(v.id)">Block</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NoResults :query="query" :loading="loading" />
  </div>
</template>

<script>
import NoResults from "./NoResults";
import SubscribeButton from "@/components/subscription/Button";

export default {
  name: "SearchUsers",

  props: ["items", "query", "loading"],

  components: {
    NoResults,
    SubscribeButton
  },

  data() {
    return {
      openedOptions: []
    }
  },

  methods: {
    subsRequested(userId, data) {
      if (data.action === "unsubscribe") {
        this.unsubscribed(userId, data.result);
      } else if (data.action === "resubscribe") {
        this.resubscribed(userId, data.result);
      } else {
        throw new Error("Wrong action");
      }
    },
    unsubscribed(userId, result) {
      if (!result.success) {
        return;
      }
      this.$store.commit("search/page/extendUser", {
        userId,
        data: { subscribedByExpire: true }
      });
      this.$store.dispatch(
        "global/flashToast",
        "You have unsubscribed successfully"
      );
    },
    resubscribed(userId, result) {
      if (!result.success) {
        return;
      }
      this.$store.commit("search/page/extendUser", {
        userId,
        data: { subscribedByExpire: false }
      });
      this.$store.dispatch(
        "global/flashToast",
        "You have resubscribed successfully"
      );
    },
    follow(userId) {
      this.$store.dispatch("search/page/follow", userId);
    },
    unfollow(userId) {
      this.$store.dispatch("search/page/unfollow", userId);
    },
    report(userId) {
      this.$store.dispatch("modal/show", {
        name: "userReport",
        data: userId
      });
    },
    block(userId) {
      this.$store.dispatch("search/page/block", userId);
    },
    unblock(userId) {
      this.$store.dispatch("search/page/unblock", userId);
    },
    isOptionsOpened(userId) {
      return this.openedOptions.indexOf(userId) !== -1;
    },
    toggleOptions(userId) {
      if (this.isOptionsOpened(userId)) {
        this.openedOptions = this.openedOptions.filter(id => id !== userId);
      } else {
        this.openedOptions.push(userId);
      }
    }
  }
};
</script>
