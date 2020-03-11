<template>
  <Modal :onClose="close">
    <div class="popup-container popup-image videSwiperContainer" slot="content">
      <swiper
        ref="mySwiper"
        class="media-slider video-swiper"
        :options="swiperOption"
        :key="uniqId"
      >
        <swiperSlide
          v-for="media in videos"
          :key="media.id"
          class="chatImageSwiper"
        >
          <div
            class="video-placeholder icn-item"
            :class="{ processing, 'show-player': showPlayer }"
          >
            <div
              class="loader-container loader-container_center"
              v-if="processing"
            >
              <Loader
                :fullscreen="false"
                text="Media is currently processing"
                :semidark="true"
                class="text-light"
                :small="true"
              />
            </div>
            <video
              disableremoteplayback
              webkit-playsinline
              playsinline
              controls
              loop
              controlslist="nodownload"
              :poster="media.preview.source"
              ref="video"
              class="rounded-corners media-content"
              @contextmenu.prevent="() => false"
              @dragstart.prevent="() => false"
            >
              <source :src="media.src.source" type="video/mp4" />
            </video>
          </div>
        </swiperSlide>
      </swiper>
      <div :class="`media-slider-pagination pagination-${uniqId}`" />
      <div
        :class="`media-slider-navigation navigation-${uniqId}`"
        v-if="$mq === 'desktop'"
      >
        <span
          :class="
            `btn-direction btn-direction_lr-sides btn-direction_prev btn-direction_prev-left btn-prev btn-prev-${uniqId} icn-item icn-item icn-pos_center`
          "
        />
        <span
          :class="
            `btn-direction btn-direction_lr-sides btn-direction_next btn-direction_next-right btn-next btn-next-${uniqId} icn-item icn-item icn-pos_center`
          "
        />
      </div>
      <button
        type="button"
        class="close close_light close_visible-mob icn-item icn-size_lg"
        @click="close"
      />
    </div>
  </Modal>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";

export default {
  name: "videoSwiperModal",
  components: {
    Modal,
    swiper,
    swiperSlide,
    Loader
  },
  data() {
    const uniqId = Math.random()
      .toString(36)
      .substr(2, 9);

    const self = this;
    return {
      showPlayer: false,
      uniqId,
      activeSlide: 0,
      swiperOption: {
        autoHeight: true,
        spaceBetween: 10,
        preloadImages: true,
        pagination: {
          el: `.pagination-${uniqId}`,
          clickable: true,
          bulletClass: "item",
          bulletActiveClass: "active"
        },
        navigation: {
          nextEl: `.btn-next.btn-next-${uniqId}`,
          prevEl: `.btn-prev.btn-prev-${uniqId}`,
          hiddenClass: "hidden",
          disabledClass: "hidden"
        },
        on: {
          slideChange() {
            self.activeSlide = this.activeIndex;
          }
        }
      }
    };
  },
  computed: {
    videos() {
      return this.$store.state.modal.videoSwiper.data.videos;
    },
    message() {
      return this.$store.state.modal.videoSwiper.data.message;
    },
    processing() {
      return !this.message.isMediaReady;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "videoSwiper", data: {} });
    },
    play(media) {
      if (media.locked) {
        return;
      }
      if (this.processing) {
        return;
      }
      this.showPlayer = true;
      this.$refs.video.play();
    }
  },
  mounted() {
    const index = this.$store.state.modal.videoSwiper.data.index;
    this.activeSlide = index;
  }
};
</script>

<style lang="scss" scoped>
.chatImageSwiper {
  width: 100% !important;
}
.video-placeholder {
  &:after {
    display: none;
  }
}
.videSwiperContainer {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
