<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <template>
          <div class="popup-alert__title">
            Public and private groups with free access to the video
          </div>
          <div class="popup-alert__body">
            <div class="searchHeader">
              <SearchBubble @addGroup="addGroup" />
            </div>
            <div class="list">
              <h2 v-if="!freeAccessGroups.length" class="title__empty">
                Have no groups with free access
              </h2>
              <template v-else>
                <div
                  class="item"
                  v-for="(group, i) in freeAccessGroups"
                  :key="group.id"
                >
                  <div class="index table__cell">
                    {{ i + 1 }}
                  </div>
                  <span class="avatar avatar_sm">
                    <span class="avatar__img">
                      <img :src="group.image" v-if="group.image" />
                    </span>
                  </span>
                  <div class="user table__cell">
                    <div class="name">{{ group.title }}</div>
                  </div>
                  <div class="user table__cell delete">
                    <button
                      @click="removeItem(group.id)"
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
import SearchBubble from "../searchGroups/Index";
import ConvertTextMixin from "@/mixins/convertText";

export default {
  name: "FreeAccessMediaGroupsModal",
  components: {
    Modal,
    SearchBubble
  },
  mixins: [ConvertTextMixin],
  data() {
    return {
      freeAccessGroups: [
        // {
        //   id: 468790,
        //   title: "title 1",
        //   image: "https://cdn2-dev-media.avn.com/files/6/61/61f06a142625fe884d885ae4d9b747c3/cube-arch-logo.jpg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6XC9cL2NkbjItZGV2LW1lZGlhLmF2bi5jb21cL2ZpbGVzXC82XC82MVwvNjFmMDZhMTQyNjI1ZmU4ODRkODg1YWU0ZDliNzQ3YzNcL2N1YmUtYXJjaC1sb2dvLmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU5NTY4MjM2NH0sIklwQWRkcmVzcyI6eyJBV1M6U291cmNlSXAiOiIxMDkuODcuMjUzLjIyM1wvMzIifX19XX0_&Signature=QNhuVGYff63uiy-7xwH8Wxn2GdeEBwXKm40r1Sb8ik6qpVxSTByfcemelE5dIBRkauavzQZN6lj1b~nU1FZ6DswhhStZHUCMMaFCYu4dmsPNAQPXpkE5PZ2Y4fTPkGcQT4je-16H05AbA8J6bb9AixcvtVoYiNNHxjtT7GSpo2bmkiDqzGDoCEl~h754awMn2ok-e1BxdNtnspOOROtL3Qtm-ikprQJcmvtjDfn0eVgsh3OP1dL9z0K90A6xuBp5vncNW2n6Q3ciSmd0BAm~3SdgHewMOE0316PrTDjNVB0iGS6ktBzgSVES28aumokDxJLC0n4deD9riglwUwOonA__&Key-Pair-Id=APKAIZQN3TWWCTQ5Z6ZQ"
        // },
        // {
        //   id: 468791,
        //   title: "title 2",
        //   image: "https://cdn2-dev-media.avn.com/files/6/61/61f06a142625fe884d885ae4d9b747c3/cube-arch-logo.jpg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6XC9cL2NkbjItZGV2LW1lZGlhLmF2bi5jb21cL2ZpbGVzXC82XC82MVwvNjFmMDZhMTQyNjI1ZmU4ODRkODg1YWU0ZDliNzQ3YzNcL2N1YmUtYXJjaC1sb2dvLmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU5NTY4MjM2NH0sIklwQWRkcmVzcyI6eyJBV1M6U291cmNlSXAiOiIxMDkuODcuMjUzLjIyM1wvMzIifX19XX0_&Signature=QNhuVGYff63uiy-7xwH8Wxn2GdeEBwXKm40r1Sb8ik6qpVxSTByfcemelE5dIBRkauavzQZN6lj1b~nU1FZ6DswhhStZHUCMMaFCYu4dmsPNAQPXpkE5PZ2Y4fTPkGcQT4je-16H05AbA8J6bb9AixcvtVoYiNNHxjtT7GSpo2bmkiDqzGDoCEl~h754awMn2ok-e1BxdNtnspOOROtL3Qtm-ikprQJcmvtjDfn0eVgsh3OP1dL9z0K90A6xuBp5vncNW2n6Q3ciSmd0BAm~3SdgHewMOE0316PrTDjNVB0iGS6ktBzgSVES28aumokDxJLC0n4deD9riglwUwOonA__&Key-Pair-Id=APKAIZQN3TWWCTQ5Z6ZQ"
        // },
        // {
        //   id: 468792,
        //   title: "title 3",
        //   image: "https://cdn2-dev-media.avn.com/files/6/61/61f06a142625fe884d885ae4d9b747c3/cube-arch-logo.jpg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6XC9cL2NkbjItZGV2LW1lZGlhLmF2bi5jb21cL2ZpbGVzXC82XC82MVwvNjFmMDZhMTQyNjI1ZmU4ODRkODg1YWU0ZDliNzQ3YzNcL2N1YmUtYXJjaC1sb2dvLmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU5NTY4MjM2NH0sIklwQWRkcmVzcyI6eyJBV1M6U291cmNlSXAiOiIxMDkuODcuMjUzLjIyM1wvMzIifX19XX0_&Signature=QNhuVGYff63uiy-7xwH8Wxn2GdeEBwXKm40r1Sb8ik6qpVxSTByfcemelE5dIBRkauavzQZN6lj1b~nU1FZ6DswhhStZHUCMMaFCYu4dmsPNAQPXpkE5PZ2Y4fTPkGcQT4je-16H05AbA8J6bb9AixcvtVoYiNNHxjtT7GSpo2bmkiDqzGDoCEl~h754awMn2ok-e1BxdNtnspOOROtL3Qtm-ikprQJcmvtjDfn0eVgsh3OP1dL9z0K90A6xuBp5vncNW2n6Q3ciSmd0BAm~3SdgHewMOE0316PrTDjNVB0iGS6ktBzgSVES28aumokDxJLC0n4deD9riglwUwOonA__&Key-Pair-Id=APKAIZQN3TWWCTQ5Z6ZQ"
        // },
      ],
      initSnapshot: [],
      isDataChanged: false,
      saving: false
    };
  },
  computed: {
    data() {
      return this.$store.state.modal.freeAccessMediaGroups.data;
    },
    items() {
      return this.data.post.freeAccessGroups;
    }
  },
  methods: {
    init() {
      if (this.items && this.items.length) {
        this.freeAccessGroups = [...this.items];
        this.initSnapshot = this.items.map(item => item.id);
      }
    },
    close({ reset }) {
      if (reset) {
        this.freeAccessGroups = this.items || [];
      }
      this.$store.commit("modal/hideSafe", { name: "freeAccessMediaGroups" });
    },
    save() {
      this.saving = true;
      this.$store
        .dispatch("profile/media/updateMedia", this.getMediaData(), {
          root: true
        })
        .then(() => {
          this.initSnapshot = this.freeAccessGroups.map(item => item.id);
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
          text: this.getConvertedText(this.data.post.text),
          freeAccessUsers: this.data.post.freeAccessUsers.map(item => item.id),
          freeAccessGroups: this.freeAccessGroups.map(item => item.id)
        },
        productId: this.data.post.productId
      };
    },
    removeItem(groupId) {
      this.freeAccessGroups = this.freeAccessGroups.filter(
        item => item.id !== groupId
      );
      this.isListChangesCheck();
    },
    addGroup(group) {
      const isAlreadyInList = this.freeAccessGroups.find(
        item => item.id === group.id
      );
      if (isAlreadyInList || group.id === this.data.post.author.id) {
        return;
      }
      this.freeAccessGroups.push(group);
      this.isListChangesCheck();
    },
    isListChangesCheck() {
      let isChanged = false;
      if (this.freeAccessGroups.length !== this.initSnapshot.length) {
        this.isDataChanged = true;
        return;
      }
      for (let i = 0; i < this.freeAccessGroups.length; i++) {
        if (this.freeAccessGroups[i].id !== this.initSnapshot[i]) {
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
  max-width: 200px;
  &.delete {
    margin-left: auto;
  }
}
.avatar {
  margin: 0 10px;
}
</style>
