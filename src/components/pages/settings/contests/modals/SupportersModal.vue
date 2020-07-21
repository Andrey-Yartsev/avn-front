<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <template>
          <div class="popup-alert__title">
            Contest Supporters
          </div>
          <div class="popup-alert__body">
            <div class="list">
              <h2
                v-if="!supporters.length && allDataRecieved"
                class="title__empty"
              >
                Have no supporters for now
              </h2>
              <template v-if="supporters.length">
                <div
                  class="item"
                  v-for="(user, i) in supporters"
                  :key="user.username"
                >
                  <div class="index table__cell">
                    {{ i + 1 }}
                  </div>
                  <div class="user table__cell">
                    <router-link
                      :to="'/' + user.username"
                      class="userview-block"
                    >
                      <span class="avatar avatar_sm">
                        <span class="avatar__img">
                          <img :src="user.avatar" v-if="user.avatar" />
                        </span>
                      </span>
                      <div class="name">{{ user.name }}</div>
                      <span class="user-login reset-ml">{{
                        user.username
                      }}</span>
                    </router-link>
                  </div>
                  <div class="user table__cell delete">$ {{ user.amount }}</div>
                </div>
              </template>

              <div
                style="width: 100%; height: 1px"
                v-if="supporters.length"
                ref="scrollObserver"
              ></div>
              <div
                v-if="supporters.length && !allDataRecieved"
                class="loader-container"
              >
                <Loader text="" :fullscreen="false" :small="true" />
              </div>
            </div>
          </div>
          <div class="popup-alert__footer">
            <button class="btn alt" @click.prevent="close()">
              Close
            </button>
          </div>
        </template>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";
import SearchBubble from "@/components/common/profile/media/parts/searchUsers/Index";
import IntersectionObserver from "@/mixins/intersectionObserver";

export default {
  name: "ContestSupportersModal",
  mixins: [IntersectionObserver],
  components: {
    Modal,
    SearchBubble,
    Loader
  },
  computed: {
    contestId() {
      return this.$store.state.modal.contestSupporters.data.contestId;
    },
    supporters() {
      return this.$store.state.contest.settings.supporters;
    },
    allDataRecieved() {
      return this.$store.state.contest.settings.allSupportersReceived;
    }
  },
  methods: {
    init() {
      this.$store
        .dispatch("contest/settings/getSupporters", {
          contestId: this.contestId
        })
        .then(() => {
          this.isInitFetch = false;
          this.handleResponseWithIntersectionObserver(this.init);
        });
    },
    close() {
      this.destroyObserver();
      this.$store.commit("contest/settings/resetSupporters");
      this.$store.commit("modal/hideSafe", { name: "contestSupporters" });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.popup-alert__link {
  margin: 10px 0;
  color: #2196f3;
}
.searchHeader {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* & > div {
    display: flex !important;
    position: relative;
  } */
}
.title__empty {
  margin-top: 30px;
  opacity: 0.5;
}
.popup-alert__body {
  .list {
    height: 350px;
    overflow: auto;
    padding: 0 10px;
  }
  .item {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 15px 0;
  }
}
.user.table__cell {
  &.delete {
    margin-left: auto;
    white-space: nowrap;
  }
}
.loader-container {
  margin: 10px auto;
}
.table__cell.index {
  width: 25px;
}
.userview-block {
  margin-left: 10px;
}
</style>
