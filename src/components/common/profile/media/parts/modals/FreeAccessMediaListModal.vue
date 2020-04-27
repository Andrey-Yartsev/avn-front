<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <template>
          <div class="popup-alert__title">
            Users with free access to the video
          </div>
          <div class="popup-alert__body">
            <div class="searchHeader">
              <SearchBubble @addUser="addUser" />
            </div>
            <div class="list">
              <h2 v-if="!freeAccessUsers.length" class="title__empty">
                Have no users with free access
              </h2>
              <template v-else>
                <div
                  class="item"
                  v-for="(user, i) in freeAccessUsers"
                  :key="user.id"
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
                  <div class="user table__cell delete">
                    <button
                      @click="removeUser(user.id)"
                      type="button"
                      class="btn-reset icn-item icn-size_lg"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="popup-alert__footer">
            <button
              class="btn alt"
              @click.prevent="save"
              :disabled="!isDataChanged || saving"
            >
              Save
            </button>
            <button
              :disabled="saving"
              class="btn alt"
              @click.prevent="close({ reset: true })"
            >
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
import SearchBubble from "../searchUsers/Index";

export default {
  name: "FreeAccessMediaListModal",
  components: {
    Modal,
    SearchBubble
  },
  data() {
    return {
      freeAccessUsers: [
        // {
        //   id: 468790,
        //   name: "some_name",
        //   username: "user888",
        //   avatar:
        //     "https://cdn2-dev-media.avn.com/files/u/ur/urn/urnzuu17af7nsr1pms5d7n2evojkh6lp1587364787/l800.jpg?Expires=1618938002&Signature=b28~EXxEAYkn4414bNwUF2~VP~BrC3HPlET6sm4uMgZSE14RqCu9zNkJMY214Uj2RBKb23TKYl6h2yn~5ItGr7w0O~unxM1cIxd70A6gMSyzxdpSFCj0DTi6iSJQwl3MjlQ3EqseORRu4Ulbp~rx3E3j-uFUgZbCAeJiiroUP0f1-bFlddajJufnd3RPePAiP5l-UYEakB-W4sFDaXElvcCTKvXGuZLFIOyokQwyT3WCazwk8QF-qHitxSNo4NqPGKityV1jeEBhhATmLfx-eKDutpsrulZAneGivpW6qEySm0YlJ-vkdK9IPyGG1F4ayRh9b0dtTVkAVWRQ2QnuZg__&Key-Pair-Id=APKAIZQN3TWWCTQ5Z6ZQ"
        // },
        // {
        //   id: 468755,
        //   name: "itest4 968ᗰ🦊",
        //   username: "itest4",
        //   avatar:
        //     "https://cdn2-dev-media.avn.com/files/a/a1/a1t/a1ti42xzczpsxc8qn57rxf1dlblmxdty1579700339/avatar.jpg?Expires=1618938002&Signature=DUczNiLQNMvFU45XTJpeR7BJp~FG13Z7lBAXByUhvdODNfWvf5U4tDi81Lr3BaI6nCZPeDVgcL5zzoxr3QGhMDorDxnu8PWSEsHWX8R~CdiN38UjeEzQTapVkc38QkuMKZ43DqrGBFbe61mVqGySXiblHUBINGlTykyLTQoVOjuXra5-oiM4t7CjxhiWcuyYu66NyhKR0Rmk9nYBFy7oKC-KUZmiwke5bIqe5Mo8007kG02B7FDchIRSM11AMjJtwjSRi9HOfMSuICVG8cdcwcggHwF06ZTb-DrMb677Z8Sp7-z-3FDF-5Ne~vSjSk3wgkEbouqLGXZN7Tv66huroQ__&Key-Pair-Id=APKAIZQN3TWWCTQ5Z6ZQ"
        // },
        // {
        //   id: 468732,
        //   name: "itest2 413 🐼",
        //   username: "itest2",
        //   avatar:
        //     "https://cdn2-dev-media.avn.com/files/q/qc/qch/qchbe2farz3e2odsdntf1auinzx6qiuk1563788844/avatar.jpg?Expires=1618938002&Signature=e-RSel~PUa2JgYSmA0Vuz~dQFr0xXw5fgO1-W2Rqko9meaK0zz-Ct3AdtVusdDDp7UytxE3KQoi~uKu5jenHGjrGcXgwBJaY7ezbVgPGehnqdUqCkJDkjjG-Wfj5~RLHR7qXypBk562DBYFI-3hXRKcyENT4WJ43y0pY3S1msOqXJU5luqEwVmQLuMYbXibtXEJTPEEa49NCe~OHON6l515g6A4~ei~suX7gOoppLHavTxA-tZL~E5FtZCAYzWynhQ2cv2LuCb52idYK5slnmReBcQv39r9rxn97hrrare0kjzLmf0ja252rZVopwbHS7aNYN51TUwvW-snQO5xQJA__&Key-Pair-Id=APKAIZQN3TWWCTQ5Z6ZQ"
        // },
      ],
      initSnapshot: [],
      isDataChanged: false,
      saving: false
    };
  },
  computed: {
    data() {
      return this.$store.state.modal.freeAccessMediaList.data;
    },
    users() {
      return this.data.post.freeAccessUsers;
    }
  },
  methods: {
    init() {
      if (this.users && this.users.length) {
        this.freeAccessUsers = [...this.users];
        this.initSnapshot = this.users.map(item => item.id);
      }
    },
    close({ reset }) {
      if (reset) {
        this.freeAccessUsers = this.users || [];
      }
      this.$store.commit("modal/hideSafe", { name: "freeAccessMediaList" });
    },
    save() {
      this.saving = true;
      this.$store
        .dispatch("profile/media/updateMedia", this.getMediaData(), {
          root: true
        })
        .then(() => {
          this.initSnapshot = this.freeAccessUsers.map(item => item.id);
          this.close({ reset: false });
        })
        .finally(() => {
          this.saving = false;
        });
    },
    getMediaData() {
      return {
        media: {
          ...this.data.post,
          freeAccessUsers: this.freeAccessUsers.map(item => item.id)
        },
        productId: this.data.post.productId
      };
    },
    removeUser(userId) {
      this.freeAccessUsers = this.freeAccessUsers.filter(
        item => item.id !== userId
      );
      this.isListChangesCheck();
    },
    addUser(user) {
      const isAlreadyInList = this.freeAccessUsers.find(
        item => item.id === user.id
      );
      if (isAlreadyInList || user.id === this.data.post.author.id) {
        return;
      }
      this.freeAccessUsers.push(user);
      this.isListChangesCheck();
    },
    isListChangesCheck() {
      let isChanged = false;
      if (this.freeAccessUsers.length !== this.initSnapshot.length) {
        this.isDataChanged = true;
        return;
      }
      for (let i = 0; i < this.freeAccessUsers.length; i++) {
        if (this.freeAccessUsers[i].id !== this.initSnapshot[i]) {
          isChanged = true;
          break;
        }
      }
      this.isDataChanged = isChanged;
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
  }
}
</style>
