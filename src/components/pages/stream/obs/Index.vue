<template>
  <div class="obs stream-block">
    <template v-if="user">
      <Loader
        v-if="loading"
        :fullscreen="false"
        :inline="true"
        text=""
        :small="true"
      />
      <template v-else>
        <a href="" @click.prevent="logout" class="logout">Logout</a>
        <div class="obs-filter" v-if="!filterOnesSelected">
          <AccessFilter
            :value="localStream.type"
            @changed="visibilityChanged"
          />
        </div>
        <div class="form-comments">
          <Comments :shownComments="comments" :count="comments.length" />
          <AddComment :_stream="stream" />
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import AccessFilter from "./AccessFilter";
import Comments from "../../../common/streamComments/Index";
import AddComment from "../../../common/streamComments/AddComment";
import User from "@/mixins/user";

export default {
  name: "ObsChat",
  mixins: [User],
  components: {
    Loader,
    AccessFilter,
    Comments,
    AddComment
  },
  data() {
    return {
      localStream: null,
      filterOnesSelected: false
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
