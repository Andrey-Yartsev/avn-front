<template>
  <div class="sidebar" v-if="user">
    <div class="sidebar__wrap-close" v-if="$mq === 'mobile'">
      <span
        role="button"
        class="close icn-item user-menu-close hidden-desktop icn-size_lg"
        @click="hide"
      />
    </div>
    <perfect-scrollbar class="sidebar__scroller">
      <router-link
        :to="'/' + user.username"
        class="avatar header-avatar"
        v-if="$mq === 'mobile'"
      >
        <span class="avatar__img">
          <img v-if="user.avatar" :src="user.avatar" />
        </span>
      </router-link>
      <div class="sidebar__inside">
        <div class="sidebar__header">
          <div class="user-group-info">
            <div class="user-menu-name">
              <router-link :to="'/' + user.username" class="name">{{
                user.name
              }}</router-link>
              <span
                class="verified-user icn-item"
                :class="{
                  fullyMonetized: user.canEarn && user.canPayoutsRequest
                }"
                v-if="
                  user.isVerified || (user.canEarn && user.canPayoutsRequest)
                "
              ></span>
            </div>
            <div class="user-menu-login user-login reset-ml">
              <router-link :to="'/' + user.username">{{
                user.username
              }}</router-link>
            </div>
          </div>
          <div class="user-menu-counts">
            <router-link to="/following" class="user-menu-counts-item">
              <span class="user-menu-counts-item-count" id="sidebarFollowing">{{
                user.followingCount
              }}</span
              >&nbsp;
              <span class="user-menu-counts-item-title">Following</span>
            </router-link>
            <router-link to="/followers" class="user-menu-counts-item">
              <span class="user-menu-counts-item-count" id="sidebarFollowers">{{
                user.followersCount
              }}</span
              >&nbsp;
              <span class="user-menu-counts-item-title">Followers</span>
            </router-link>
          </div>
        </div>
        <div class="sidebar-menu">
          <nav class="user-menu">
            <div class="user-menu__col">
              <router-link
                class="user-menu-item user-menu-item__profile icn-item"
                :to="'/' + user.username"
                >Profile</router-link
              >
              <router-link
                v-for="(v, i) in nominationRoutes"
                class="user-menu-item icn-item"
                :class="'user-menu-item__award-avn'"
                :to="v.path ? v.path : '/settings/' + v.name"
                :key="'i' + i"
                >{{ v.title }}</router-link
              >
              <router-link
                class="user-menu-item user-menu-item__statistics icn-item"
                to="/statistics"
                >Statistics</router-link
              >
              <router-link
                class="user-menu-item user-menu-item__payouts icn-item"
                to="/settings/payouts"
                >Payouts</router-link
              >
              <router-link
                class="user-menu-item user-menu-item__payments icn-item"
                to="/settings/payments"
                >Payments
              </router-link>

              <template v-if="userIsAdmin">
                <router-link
                  class="user-menu-item user-menu-item__award-avn icn-item"
                  to="/settings/avn"
                  >AVN Awards
                </router-link>
                <router-link
                  class="user-menu-item user-menu-item__award-avn icn-item"
                  to="/avn_awards/voting"
                  >AVN Awards Voting
                </router-link>
                <router-link
                  class="user-menu-item user-menu-item__award-gayvn icn-item"
                  to="/settings/gayvn"
                  >GayVN Awards
                </router-link>
                <router-link
                  class="user-menu-item user-menu-item__award-gayvn icn-item"
                  to="/gayvn_awards/voting"
                  >GayVN Awards Voting
                </router-link>
              </template>

              <template v-else-if="!userIsAdmin && isAwardsActive">
                <template v-if="userViewIsAll || userViewIsStreight">
                  <template v-if="isVotingEnabled">
                    <router-link
                      v-if="user.nominee && userHasStraightNominations"
                      class="user-menu-item user-menu-item__award-avn icn-item"
                      to="/settings/avn"
                    >
                      AVN Awards Promo Link
                    </router-link>
                    <router-link
                      class="user-menu-item user-menu-item__award-avn icn-item"
                      to="/avn_awards/voting"
                      >AVN Awards Voting
                    </router-link>
                  </template>
                  <router-link
                    v-else
                    class="user-menu-item user-menu-item__award-avn icn-item"
                    to="/settings/avn"
                  >
                    AVN Awards
                  </router-link>
                </template>

                <template v-if="userViewIsAll || userViewIsGay">
                  <template v-if="isVotingGayEnabled">
                    <router-link
                      v-if="user.nominee && userHasGayNominations"
                      class="user-menu-item user-menu-item__award-gayvn icn-item"
                      to="/settings/gayvn"
                    >
                      GayVN Awards Promo Link
                    </router-link>
                    <router-link
                      class="user-menu-item user-menu-item__award-gayvn icn-item"
                      to="/gayvn_awards/voting"
                      >GayVN Awards Voting
                    </router-link>
                  </template>
                  <router-link
                    v-else
                    class="user-menu-item user-menu-item__award-avn icn-item"
                    to="/settings/gayvn"
                  >
                    GayVN Awards
                  </router-link>
                </template>
              </template>

              <router-link
                v-if="user.canEarn"
                class="user-menu-item user-menu-item__subscribers icn-item"
                to="/settings/subscribers"
                >Subscribers
              </router-link>
              <router-link
                class="user-menu-item user-menu-item__magazine icn-item"
                to="/settings/magazine"
                >AVN Magazine
              </router-link>
              <router-link
                v-if="user.isPerformer && user.storeEnabled"
                class="user-menu-item user-menu-item__clipStore icn-item"
                :to="'/' + user.username + '/media'"
                >Clip Store
              </router-link>
              <router-link
                v-if="contestsEnabled"
                class="user-menu-item icn-item user-menu-item__award-avn"
                :to="'/settings/contests'"
                >Contests
              </router-link>
            </div>
            <div class="user-menu__col">
              <router-link
                class="user-menu-item user-menu-item__privacy icn-item"
                to="/settings"
                >Settings and Privacy
              </router-link>
              <router-link
                class="user-menu-item user-menu-item__help icn-item"
                to="/contact"
                >Help</router-link
              >
              <router-link
                class="user-menu-item user-menu-item__logout icn-item"
                to="/logout"
                >Log out</router-link
              >
            </div>
          </nav>
          <div class="user-menu-bottom-btns">
            <span
              role="button"
              class="user-menu-bottom-btn user-menu-bottom-btn__skin-toggle"
              @click="toggleDarkTheme"
              ><span
                class="icn-theme icn-item"
                v-tooltip="'Change theme'"
              ></span
            ></span>
            <span
              role="button"
              :data-clipboard-text="'/' + user.username"
              :data-title="user.username"
              class="user-menu-bottom-btn user-menu-bottom-btn__share"
              @click="copyToClipboard"
              ><span class="icn-share icn-item" v-tooltip="'Copy link'"></span
            ></span>
          </div>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import nominationRoutes from "@/components/common/nominationSettingsRoutes";

export default {
  name: "Sidebar",
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    contestsEnabled() {
      return (
        this.user?.showVote || // showVote is admin user, renamed for secure reason
        this.user?.adminReturnUrl ||
        (this.user?.canEarn && this.$store.state.init.data.enableContests)
      );
    },
    nominationRoutes() {
      if (!this.user || !this.user.adminReturnUrl) {
        return [];
      }
      return nominationRoutes(this.user);
    },
    isVotingEnabled() {
      return this.$store.state.init.data.enableVoting;
    },
    isVotingGayEnabled() {
      return this.$store.state.init.data.enableGayVoting;
    },
    userIsGay() {
      return this.user.category === 3;
    },
    userViewIsGay() {
      return this.user.categoryView === 3;
    },
    userViewIsAll() {
      return this.user.categoryView === 1;
    },
    userViewIsStreight() {
      return this.user.categoryView === 2;
    },
    userHasGayNominations() {
      return this.user.nominatedList.find(
        item => item.eventId == process.env.VUE_APP_GAY_AWARDS_EVENT_ID
      );
    },
    userHasStraightNominations() {
      return this.user.nominatedList.find(
        item => item.eventId == process.env.VUE_APP_AWARDS_EVENT_ID
      );
    },
    userIsAdmin() {
      return (
        (this.user && this.user.adminReturnUrl) ||
        (this.user && this.user.showVote)
      );
    },
    isAwardsActive() {
      return process.env.VUE_APP_IS_AWARDS_ACTIVE === "true";
    }
  },
  methods: {
    hide() {
      this.$store.dispatch("global/hideUserMobileBar");
      document.body.classList.remove("sidebar-shown", "disable-scroll-page");
    },
    copyToClipboard() {
      this.$copyText(window.location.origin + "/" + this.user.username).then(
        () => {
          this.$store.dispatch("global/flashToast", {
            text: "Profile link copied!"
          });
        }
      );
    },
    toggleDarkTheme() {
      this.$store.dispatch("global/toggleDarkTheme");
    }
  }
};
</script>
