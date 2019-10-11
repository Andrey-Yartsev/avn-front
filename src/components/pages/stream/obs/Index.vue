<template>
  <div class="obs stream-block">
    <template v-if="user">
      <Loader
        v-if="loading"
        :fullscreen="true"
        :inline="true"
        :small="true"
        class="text-light"
      />
      <div v-else-if="needToStartStream" class="refresh-block">
        <div>Need to start stream</div>
        <button class="btn lg btn_fix-width" @click="refresh">Refresh</button>
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
            :style="{ top: `400px`, left: `70px` }"
          >
            <div class="like-icon">
              <div class="like-icon__symbol icn-item" />
            </div>
          </div>
        </div>

        <!--
        <StreamViewers
          :type="asideType"
          :block="showBlockUserConfirm"
          :kick="showKickUserConfirm"
        />
        -->
        <div class="form-comments">
          <Comments :shownComments="comments" :count="comments.length" />
          <AddComment :_stream="stream" />
        </div>
        <StreamerControls
          :asideType="asideType"
          @changeType="type => (asideType = type)"
        />
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
import User from "@/mixins/user";

export default {
  name: "ObsChat",
  mixins: [User],
  components: {
    Loader,
    AccessFilter,
    Comments,
    AddComment,
    StreamerControls
  },
  data() {
    return {
      localStream: null,
      filterOnesSelected: false,
      asideType: "comments"
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
    }
  },
  methods: {
    join() {
      const token = this.$store.state.auth.token;
      this.$root.ws.send({
        act: "stream_look",
        stream_id: this.stream.id,
        stream_user_id: this.stream.user.id,
        sess: token
      });
      this.$root.ws.send({
        act: "stream_start",
        stream_id: this.stream.id,
        stream_user_id: this.stream.user.id,
        sess: token
      });
    },
    update(data) {
      const stream = { ...this.stream, ...data };
      this.localStream = stream;
      this.$store.dispatch("obs/update", stream);
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
    }
  },
  watch: {
    stream() {
      this.localStream = { ...this.stream };
      this.join();
    },
    user: {
      immediate: true,
      handler(user) {
        if (user) {
          this.$store.dispatch("obs/fetch");
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
  }
};
</script>
