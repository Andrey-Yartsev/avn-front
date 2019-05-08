<template>
  <div class="userView userView_dropdown userView_dropdown-up">
    <Loader
      :fullscreen="false"
      text=""
      class="transparent small"
      v-if="loading"
    />
    <template v-else>
      <div class="arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="300"
          height="100"
          viewBox="0 0 600 200"
        >
          <defs>
            <clipPath id="clipping">
              <polygon points="50,10 60,0 70,10 50,10"></polygon>
            </clipPath>
          </defs>
          <image
            xlink:href="https://avnsocial-dev.s3.amazonaws.com/files/v/vr/vrd/vrdklpjj1svkqh7pynugn2yszpjpr8yc1554219619/avatar.jpg"
            width="480"
            height="360"
            clip-path="url(#clipping)"
          ></image>
        </svg>
      </div>
      <div class="bg bg-color bg-gradient_light">
        <img
          src="https://avnsocial-dev.s3.amazonaws.com/files/v/vr/vrd/vrdklpjj1svkqh7pynugn2yszpjpr8yc1554219619/avatar.jpg"
        />
      </div>
      <div class="user-container">
        <div class="avatar avatar_md avatar_md-desk">
          <span class="avatar__img">
            <img
              src="https://avnsocial-dev.s3.amazonaws.com/files/h/hc/hc2/hc2rseq922ltv0wnaezoaqwq47krndnv1554219620/avatar.jpg"
            />
          </span>
          <div class="stream-online-label">live</div>
        </div>
        <div class="names-actions-wrapper">
          <div class="user-names">
            <div class="wrap-name">
              <a href="/wolters" class="name">WolkWolkWolkWolkWolkWolkWolk</a>
              <span class="verified-user"></span>
              <span class="follow-link">Follow</span>
            </div>
            <span class="user-login reset-ml">
              <a href="/wolters" class="">wolters</a>
            </span>
          </div>
        </div>
        <p class="profile-text">
          <a href="https://avn2.retloko.com/wolters"
            >https://avn2.retloko.com/wolters</a
          ><br />
          cvzxcvzxcvzxc<br />
          fvsz dg d hdztgsd stgsdh aetdhseheththseth thz<a
            href="https://avn2.retloko.com/wolters"
            >https://avn2.retloko.com/wolters</a
          ><br />
          cvzxcvzxcvzxc<br />
          fvsz dg d hdztgsd stgsdh aetdhseheththseth thz<a
            href="https://avn2.retloko.com/wolters"
            >https://avn2.retloko.com/wolters</a
          ><br />
          cvzxcvzxcvzxc<br />
          fvsz dg d hdztgsd stgsdh aetdhseheththseth thz
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
export default {
  name: "UserBubble",
  components: {
    Loader
  },
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true
    };
  }
};
</script>
