<template>
  <Modal :onClose="close">
    <div class="popup-container popup-image" slot="content">
      <div>
        <swiper
          ref="mySwiper"
          class="media-slider"
          :options="swiperOption"
          :key="uniqId"
        >
          <swiperSlide
            v-for="media in images"
            :key="media.id"
            class="chatImageSwiper"
          >
            <div class="postLink" @click="$emit('click')">
              <div class="media-wrapper">
                <img :src="media.src.source" />
              </div>
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
        <!-- <img :src="src" /> -->
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
import Photo from "@/components/post/parts/media/content/Photo";

export default {
  name: "imageSwiperModal",
  components: {
    Modal,
    swiper,
    swiperSlide,
    Photo
  },
  data() {
    const uniqId = Math.random()
      .toString(36)
      .substr(2, 9);

    // const self = this;
    return {
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
    images() {
      return this.$store.state.modal.imageSwiper.data.images;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "imageSwiper", data: {} });
    }
  }
};
</script>
