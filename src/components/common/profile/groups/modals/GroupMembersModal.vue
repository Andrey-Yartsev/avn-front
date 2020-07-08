<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <template>
          <div class="popup-alert__title">
            Group members
          </div>
          <div class="popup-alert__body">
            <div class="searchHeader">
              <SearchBubble @addUser="addUser" />
            </div>
            <div class="list">
              <h2 v-if="!members.length" class="title__empty">
                Have no group members for now
              </h2>
              <template v-else>
                <div class="item" v-for="(user, i) in members" :key="user.id">
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
import SearchBubble from "@/components/common/profile/media/parts/searchUsers/Index";

export default {
  name: "GroupMembersModal",
  components: {
    Modal,
    SearchBubble
  },
  data() {
    return {
      members: [],
      initSnapshot: [],
      isDataChanged: false,
      saving: false
    };
  },
  computed: {
    data() {
      return this.$store.state.modal.groupMembers.data;
    },
    users() {
      return this.data.group.members;
    },
    author() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    init() {
      if (this.users && this.users.length) {
        this.members = [...this.users];
        this.initSnapshot = this.users.map(item => item.id);
      }
    },
    close({ reset }) {
      if (reset) {
        this.members = this.users || [];
      }
      this.$store.commit("modal/hideSafe", { name: "groupMembers" });
    },
    save() {
      this.saving = true;
      console.log(this.getMediaData());
      this.$store
        .dispatch("profile/groups/updateGroup", this.getMediaData(), {
          root: true
        })
        .then(() => {
          this.initSnapshot = this.members.map(item => item.id);
          this.close({ reset: false });
        })
        .finally(() => {
          this.saving = false;
        });
    },
    getMediaData() {
      const data = {
        ...this.data.group,
        mediaFiles: (this.data.group.media || []).map(item => ({
          id: item.id
        })),
        members: this.members.map(item => item.id)
      };
      delete data.media;
      delete data.membersCount;
      return data;
    },
    removeUser(userId) {
      this.members = this.members.filter(item => item.id !== userId);
      this.isListChangesCheck();
    },
    addUser(user) {
      const isAlreadyInList = this.members.find(item => item.id === user.id);
      if (isAlreadyInList || user.id === this.author.id) {
        return;
      }
      this.members.push(user);
      this.isListChangesCheck();
    },
    isListChangesCheck() {
      let isChanged = false;
      if (this.members.length !== this.initSnapshot.length) {
        this.isDataChanged = true;
        return;
      }
      for (let i = 0; i < this.members.length; i++) {
        if (this.members[i].id !== this.initSnapshot[i]) {
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
