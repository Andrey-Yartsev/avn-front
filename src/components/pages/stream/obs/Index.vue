<template>
  <div class="obs stream-block">
    <template v-if="user">
      <Loader
        v-if="loading"
        :fullscreen="true"
        :inline="true"
        :small="true"
        class="text-light"
        text="Loading stream"
      />
      <div v-else-if="needToStartStream" class="refresh-block">
        <div>Need to start stream</div>
        <button class="btn lg btn_fix-width" @click="refresh">Refresh</button>
        <div class="mediasTop">
          <div
            class="mediasTop__header stream-header mediasTop__header-underlined"
          >
            <a
              href="#"
              @click.prevent="logout"
              class="btn-logout icn-item icn-size_lg"
              :class="{ 'icn-pos_center': $mq === 'desktop' }"
              >Log out</a
            >
          </div>
        </div>
      </div>
      <template v-else>
        <div class="mediasTop">
          <div
            class="mediasTop__header stream-header mediasTop__header-underlined"
          >
            <div
              class="group-controls"
              v-if="!stream.isTypeSelected && !filterOnesSelected"
            >
              <AccessFilter
                :value="localStream.type"
                @changed="visibilityChanged"
              />
            </div>
            <a
              href="#"
              @click.prevent="logout"
              class="btn-logout icn-item icn-size_lg"
              :class="{ 'icn-pos_center': $mq === 'desktop' }"
              >Log out</a
            >
          </div>
        </div>

        <div class="likesContainer">
          <div
            v-for="like in likes"
            :id="like.date"
            :key="like.date"
            class="like"
          >
            <div class="like-icon">
              <div class="like-icon__symbol icn-item" />
            </div>
          </div>
        </div>

        <div class="form-comments">
          <Comments
            v-if="asideType === 'comments'"
            :shownComments="comments"
            :count="comments.length"
          />
          <StreamViewers
            v-else
            :type="asideType"
            :block="showBlockUserConfirm"
            :kick="showKickUserConfirm"
          />
          <AddComment :_stream="stream" />
        </div>

        <StreamerControls
          :asideType="asideType"
          @changeType="type => (asideType = type)"
          :likesCount="likesCount"
          :viewsCount="viewsCount"
          :amount="amount"
        />{{ viewsCount }}
      </template>
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import AccessFilter from "./AccessFilter";
import Comments from "../../../common/streamComments/Index";
import AddComment from "../../../common/streamComments/AddComment";
import StreamerControls from "./StreamerControls";
import StreamViewers from "./Viewers";
import User from "@/mixins/user";

export default {
  name: "ObsChat",
  mixins: [User],
  components: {
    Loader,
    AccessFilter,
    Comments,
    AddComment,
    StreamerControls,
    StreamViewers
  },
  data() {
    return {
      localStream: null,
      filterOnesSelected: false,
      asideType: "comments",
      joined: false
    };
  },
  computed: {
    comments() {
      return this.$store.state.lives.currentLive.comments;
    },
    enabled() {
      return !this.localStream;
    },
    loading() {
      return this.$store.state.obs.fetchLoading;
    },
    stream() {
      return this.$store.state.obs.stream;
    },
    needToStartStream() {
      if (!this.$store.state.obs.fetchError) {
        return false;
      }
      return this.$store.state.obs.fetchError.code === 106;
    },
    likes() {
      return this.$store.state.obs.likes;
    },
    likesCount() {
      return parseInt(this.stream.likesCount) + this.likes.length;
    },
    viewsCount() {
      return (
        parseInt(this.stream.viewsCount) + this.$store.state.obs.viewers.length
      );
    },
    amount() {
      let amount = 0;
      this.$store.state.obs.tips.map(v => {
        amount += v.amount;
      });
      return amount;
    }
  },
  methods: {
    join() {
      if (this.$store.state.obs.joined) {
        return;
      }
      const token = this.$store.state.auth.token;
      this.$root.ws.send({
        act: "stream_start",
        stream_id: this.stream.id,
        stream_user_id: this.stream.user.id,
        sess: token
      });
      this.$store.commit("obs/joined", true);
    },
    update(data) {
      const stream = { ...this.stream, ...data };
      this.localStream = stream;
      return this.$store.dispatch("obs/update", stream);
    },
    visibilityChanged(type) {
      this.filterOnesSelected = true;
      this.update({ type });
      this.$store.dispatch("global/flashToast", {
        text: "Visibility changed"
      });
    },
    logout() {
      this.filterOnesSelected = false;
      this.$store.dispatch("auth/logout");
    },
    refresh() {
      window.location.reload();
    },
    // block & kick
    showBlockUserConfirm(userId) {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Block user",
          success: () => this.blockUser(userId)
        }
      });
    },
    blockUser(userId) {
      this.$store.dispatch("obs/block", {
        streamId: this.stream.id,
        userId
      });
    },
    showKickUserConfirm(userId) {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Kick user",
          success: () => this.kickUserForStream(userId)
        }
      });
    },
    kickUserForStream(userId) {
      this.$store.dispatch("obs/kick", {
        streamId: this.stream.id,
        userId
      });
    }
  },
  watch: {
    stream() {
      this.localStream = { ...this.stream };
      if (this.$root.ws.connected) {
        this.join();
      } else {
        this.$root.ws.removeListener("connect", this.join);
        this.$root.ws.addListener("connect", this.join);
      }
    },
    user: {
      immediate: true,
      handler(user) {
        if (user) {
          if (!this.stream) {
            this.$store.dispatch("obs/fetch");
          }
        } else {
          this.$store.dispatch("modal/show", {
            name: "login",
            data: {
              disableClose: true,
              disableFooter: true
            }
          });
        }
      }
    }
  },
  mounted() {
    this.$store.commit("chat/blockNewMessagesHandling", true);
  },
  beforeDestroy() {
    this.$store.commit("chat/blockNewMessagesHandling", false);
    this.$root.ws.removeListener("connect", this.join);
    this.$store.commit("obs/joined", false);
  }
};
</script>
