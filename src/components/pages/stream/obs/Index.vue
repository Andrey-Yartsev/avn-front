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
        <div class="stream_stop" v-if="isSelfStreamStopped">
          <StreamObsStatistic
            :close="
              (haveToSave, haveToSaveComments) =>
                close({}, haveToSave, haveToSaveComments)
            "
            :duration="time"
            :streamDuration="0"
            :streamStartTime="streamStartTime"
            :canBeSaved="canBeSaved"
            :loading="false"
            :saving="saving"
          />
        </div>
        <div v-else>Need to start stream</div>
        <!-- <div class="mediasTop">
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
        </div> -->
      </div>
      <template v-else>
        <div class="mediasTop">
          <div class="mediasTop__header stream-header">
            <div class="group-controls">
              <AccessFilter
                v-if="!stream.isTypeSelected && !filterSelected"
                :value="localStream.type"
                @changed="visibilityChanged"
              />
              <NotificationsMenu />
            </div>
            <button
              @click="stop"
              class="btn lg btn_fix-width"
              :class="{ 'icn-pos_center': $mq === 'desktop' }"
              :disabled="stopDisabled"
            >
              Stop stream
            </button>
            <!--
            <a
              href="#"
              @click.prevent="logout"
              class="btn-logout icn-item icn-size_lg"
              :class="{ 'icn-pos_center': $mq === 'desktop' }"
              >Log out</a
            >
            -->
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
        <div
          class="stream-tipsGoalTitle obs"
          v-if="activeTipsGoal.amount && activeTipsGoal.description"
        >
          TIP Countdown: ${{ activeTipsGoal.amount.toFixed(2) }} for
          {{ activeTipsGoal.description }}
        </div>

        <div class="stream-forms">
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
            <AddComment :_stream="stream" v-if="asideType === 'comments'" />
          </div>
          <TipsGoalForm
            v-if="showTipsGoalForm"
            :tipsGoal="tipsGoal"
            :sendTipGoal="sendTipGoal"
          />
        </div>
        <StreamerControls
          :asideType="asideType"
          @changeType="type => (asideType = type)"
          :likesCount="likesCount"
          :viewsCount="viewsCount"
          :amount="amount"
          :isTipsGoalExists="isTipsGoalExists"
          :toggleTipGoalForm="toggleTipGoalForm"
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
import TipsGoalForm from "./TipsGoalForm";
import StreamViewers from "./Viewers";
import User from "@/mixins/user";
import TipsGoal from "@/mixins/tipsGoal";
import StreamObsStatistic from "@/components/pages/stream/obs/StatisticObs";
import StreamApi from "@/api/stream";
import moment from "moment";
import LoadScripts from "@/components/statistics/loadScripts";
import NotificationsMenu from "../menu/Notifications";

export default {
  name: "ObsChat",
  mixins: [User, TipsGoal, LoadScripts],
  components: {
    Loader,
    AccessFilter,
    Comments,
    AddComment,
    StreamerControls,
    StreamViewers,
    TipsGoalForm,
    StreamObsStatistic,
    NotificationsMenu
  },
  data() {
    return {
      localStream: null,
      filterSelected: false,
      asideType: "comments",
      joined: false,
      stopDisabled: false,
      saving: false,
      time: "00:00"
    };
  },
  computed: {
    trigStart() {
      return this.$store.state.obs.trigStart;
    },
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
      return this.likes.length;
      // return parseInt(this.stream.likesCount) + this.likes.length;
    },
    viewsCount() {
      return this.$store.state.obs.viewers.length;
      // return (
      //   parseInt(this.stream.viewsCount) + this.$store.state.obs.viewers.length
      // );
    },
    amount() {
      let amount = 0;
      this.$store.state.obs.tips.map(v => {
        amount += v.amount;
      });
      return amount;
    },
    isSelfStreamStopped() {
      return this.$store.state.obs.selfStreamFinished;
    },
    finishedStreamData() {
      return this.$store.state.obs.selfStreamFinishedData;
    },
    streamStartTime() {
      if (!this.finishedStreamData) {
        return 0;
      }
      return new Date(this.finishedStreamData.startedAt).getTime() / 1000;
    },
    canBeSaved() {
      if (!this.finishedStreamData) {
        return false;
      }
      return (
        new Date(this.finishedStreamData.finishedAt).getTime() -
          new Date(this.finishedStreamData.startedAt).getTime() >
        5000
      );
    }
  },
  methods: {
    reset() {
      this.$store.dispatch("obs/reset");
    },
    join() {
      if (this.$store.state.obs.started) {
        return;
      }
      const token = this.$store.state.auth.token;
      this.$root.ws.send({
        act: "stream_start",
        stream_id: this.stream.id,
        stream_user_id: this.stream.user.id,
        sess: token
      });
      this.$store.commit("obs/started", this.stream);
      this.$root.ws.send({
        act: "stream_log",
        stream_id: this.stream.id,
        stream_user_id: this.stream.user.id,
        user_action: "start_success",
        stream_data: {
          type: "obs",
          view_category: this.localStream.type,
          date_time: new Date()
        },
        sess: this.$store.state.auth.token
      });
    },
    stop() {
      this.$root.ws.send({
        act: "stream_log",
        stream_id: this.stream.id,
        stream_user_id: this.stream.user.id,
        user_action: "try_to_stop",
        stream_data: {
          type: "obs",
          view_category: this.localStream.type,
          date_time: new Date()
        },
        sess: this.$store.state.auth.token
      });
      this.$store.dispatch("obs/stop", this.stream.id).then(() => {
        this.$root.ws.send({
          act: "stream_log",
          stream_id: this.localStream.id,
          stream_user_id: this.localStream.user.id,
          user_action: "stop_success",
          stream_data: {
            type: "obs",
            view_category: this.localStream.type,
            date_time: new Date()
          },
          sess: this.$store.state.auth.token
        });
      });
      this.stopDisabled = true;
      setTimeout(() => {
        this.stopDisabled = false;
      }, 10000);
    },
    update(data) {
      const stream = { ...this.stream, ...data };
      this.localStream = stream;
      return this.$store.dispatch("obs/update", stream).then(() => {
        this.$root.ws.send({
          act: "stream_log",
          stream_id: this.stream.id,
          stream_user_id: this.stream.user.id,
          user_action: "change_view_category_success",
          stream_data: {
            type: "obs",
            view_category: this.stream.type,
            date_time: new Date()
          },
          sess: this.$store.state.auth.token
        });
      });
    },
    visibilityChanged(type) {
      this.filterSelected = true;
      const data = {
        type
      };
      const defaultStreamTypes = ["subscribers", "followers", "public"];
      if (!defaultStreamTypes.includes(type)) {
        data.type = "list";
        data.entityId = type;
      }
      this.$root.ws.send({
        act: "stream_log",
        stream_id: this.stream.id,
        stream_user_id: this.stream.user.id,
        user_action: "try_to_change_view_category",
        stream_data: {
          type: "obs",
          view_category: data.type,
          date_time: new Date()
        },
        sess: this.$store.state.auth.token
      });
      this.update(data);
      this.$store.dispatch("global/flashToast", {
        text: "Visibility changed"
      });
    },
    logout() {
      this.filterSelected = false;
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
    },
    close(e, haveToSave, haveToSaveComments) {
      this.$store.commit("lives/resetCurrentLive", null, { root: true });
      if (haveToSave) {
        this.saving = true;
        this.$root.ws.send({
          act: "stream_log",
          stream_id: this.finishedStreamData.id,
          stream_user_id: this.finishedStreamData.user.id,
          user_action: "try_to_save",
          stream_data: {
            type: "obs",
            view_category: this.finishedStreamData.type,
            save_comments: haveToSaveComments,
            date_time: new Date()
          },
          sess: this.$store.state.auth.token
        });
        StreamApi.saveStream(this.finishedStreamData.id, haveToSaveComments)
          .then(() => {
            this.$root.ws.send({
              act: "stream_log",
              stream_id: this.finishedStreamData.id,
              stream_user_id: this.finishedStreamData.user.id,
              user_action: "save_success",
              stream_data: {
                type: "obs",
                view_category: this.finishedStreamData.type,
                save_comments: haveToSaveComments,
                date_time: new Date()
              },
              sess: this.$store.state.auth.token
            });
            this.$router.push("/");
          })
          .catch(() => {
            this.$router.push("/");
          });
      } else {
        this.$router.push("/");
      }
    }
  },
  watch: {
    trigStart() {
      this.join();
    },
    stream(stream) {
      if (!stream) {
        this.filterSelected = false;
        return;
      }
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
            this.$store.dispatch("obs/fetch").catch(() => {});
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
    },
    finishedStreamData(value) {
      if (!value) {
        return;
      }
      const streamEndTime = moment.unix(
        new Date(this.finishedStreamData.finishedAt).getTime()
      );
      const streamStartTime = moment.unix(
        new Date(this.finishedStreamData.startedAt).getTime()
      );

      const diffTime = streamEndTime.diff(streamStartTime);
      const duration = moment.duration(diffTime / 1000);

      let seconds = duration.seconds(),
        minute = duration.minutes(),
        hours = duration.hours();

      const _hours = hours < 10 ? `0${hours}` : `${hours}`;
      minute = minute < 10 ? `0${minute}` : `${minute}`;
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      this.time =
        hours > 0
          ? _hours + ":" + minute + ":" + seconds //
          : minute + ":" + seconds;
    }
  },
  mounted() {
    this.$store.commit("obs/isRunning", true);
    this.$store.commit("chat/blockNewMessagesHandling", true);
    this.$store.dispatch("lives/notifications/init");
  },
  beforeDestroy() {
    this.$store.commit("chat/blockNewMessagesHandling", false);
    // this.$root.ws.removeListener("connect", this.start);
    this.$store.commit("obs/started", false);
    this.$store.commit("obs/isRunning", false);
  }
};
</script>
