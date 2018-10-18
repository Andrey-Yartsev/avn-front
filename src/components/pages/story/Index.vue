<template>
  <div class="StoryPageCollectionView">
    <div class="stories-slideshow">
      <div class="StoryPageView active">
        <template v-if="post.mediaType === 'photo'">
          <img class="bg" :src="post.mediaSrc" alt>
          <img class="storyItem" :src="post.mediaSrc" alt>
        </template>
        <video 
          v-if="post.mediaType === 'video'"
          class="story-video-element storyItem" 
          :src="post.mediaSrc" 
          webkit-playsinline playsinline muted disableremoteplayback
        ></video>
      </div>
    </div>
    <template v-if="length > 1">
      <button type="button" class="btn-prev" />
      <button type="button" class="btn-next" />
    </template>
    <div class="progress-pagination">
      <div v-for="i in [1,2]" class="item" :data-index="i" :key="i">
        <div class="item-filler" />
      </div>
    </div>
    <div class="head-story">
      <div class="story-avatar">
          <a 
            :href="isOwner(post.user.id) ? `/${post.user.username}` : ''"
            :class="['avatar', {'new-story': isOwner(post.user.id)}]"
          >
            <img v-if="post.user.avatar" :src="post.user.avatar">
          </a>
          <template v-if="isOwner(post.user.id)">
            <span class="btn-add">
              <svg aria-hidden="true" class="icn icn-plus"><use xlink:href="#icon-plus-in-circle"></use></svg>
            </span>
            <input
              type="file"
              class="hidden storyFileSelect"
              accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"
            />
          </template>
      </div>
      <div class="user-name">
        <a 
          :href="isOwner(post.user.id) ? `/${post.user.username}` : ''"
          :class="{'new-story': isOwner(post.user.id)}"
        >
          {{ isOwner(post.user.id) ? 'Your story' : post.user.name || post.user.username }}
        </a>
        <span class="time"></span>
      </div>
    </div>    
    <span class="story-dropdown-menu-btn"></span>
    <div class="dropdown-menu hidden">
      <template v-if="isOwner(post.user.id)">
        <button class="deleteStory" type="button">Delete</button>
        <button class="saveFile" type="button">Save</button>
        <button class="storySettings" type="button">Story Settings</button>
      </template>
      <button class="cancelDropdown" type="button">Cancel</button>
    </div>
    <div class="bottom-btns">
      <template v-if="!isOwner(post.user.id) && post.user.canEarn">
        <button type="button" class="btn-tip"></button>
        <form class="tip-form hidden">
            <button type="button" role="button" class="btn btn-cancel">Cancel</button>
            <div class="tip-amount-field">
                <input class="tip-amount-input rounded" type="text" pattern="\d{1,5}(?:\.\d{0,2})?" maxlength="8" placeholder="Enter tip amount">
            </div>    
            <button type="submit" class="btn btn-send" disabled>Send tip</button>
        </form>
      </template>
    </div>
    <button type="button" class="close"></button>
    <div class="play-button-wrapper hidden" id="video-play-button">
      <div class="play-button-outer">
        <div class="play-button"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StorySmall",
  computed: {
    length: () => 2,
    post: () => ({
      id: 1117,
      isExpired: false,
      createDate: "2018-10-16T14:14:13+00:00",
      expireDate: "2018-10-17T14:14:13+00:00",
      mediaType: "photo",
      mediaSrc:
        "https://media.team2.retloko.com/files/o/os/osq/osqjrysqlqh9q7jycc8lioyzkh9vechh1539699253/XuayQXzmdzGrSPjkDGWHlIVXxnc2nb5j.jpg.ready.jpg",
      mediaPreview:
        "https://media.team2.retloko.com/files/7/7l/7ll/7llkzwlpapwpjdlbxcfc8w8kzg5q3bfb1539699253/preview.jpg",
      mediaThumb:
        "https://media.team2.retloko.com/files/t/tw/twk/twkrcluedioimxflamipeb6iohvtqas21539699253/thumb.jpg",
      fitType: "fit",
      isReady: true,
      isPinned: true,
      viewers: [
        {
          id: 467609,
          name: "\u041f\u0430\u0432\u0435\u043b",
          username: "grafed_spam",
          avatar:
            "https://media.team2.retloko.com/files/q/qk/qkn/qkncdkv0bv9r3mpfh7mbi5pimphvgicb1539281965/MJ1UOU_h_normal.jpeg",
          canEarn: false,
          publicUrl: "https://team2.retloko.com/grafed_spam",
          hasNotViewedStory: true,
          isVerified: true,
          isBlocked: false
        }
      ],
      user: {
        id: 467582,
        name: "alexeionline",
        username: "alexeionline",
        avatar:
          "https://media.team2.retloko.com/files/f/fn/fne/fneo363qy2iufb5gllzh4p0nk48neug71537786526/2afff3a23099780908097f84bc5da2fd_normal.jpeg",
        canEarn: false,
        publicUrl: "https://team2.retloko.com/alexeionline",
        hasNotViewedStory: false,
        isVerified: true,
        isBlocked: false,
        subscribePrice: 0,
        tipsEnabled: false,
        gender: 0,
        twitterUsername: "alexeionline",
        canWrite: false,
        subscribedBy: false,
        subscribedOn: false,
        followedBy: false,
        followedOn: false,
        joinDate: "2018-09-24T00:00:00+00:00",
        isPrivate: false,
        slogan: "",
        about: "web",
        website: "",
        location: "",
        header: null,
        defaultHeader:
          "https://team2.retloko.com/theme/project/images/background-viewme-1-grey.jpg",
        postsCount: 13,
        photosCount: 12,
        videosCount: 2,
        subscribersCount: 0,
        subscribesCount: 1,
        followersCount: 1,
        followingCount: 4,
        favoritesCount: 3,
        primaryColor: 3,
        secondColor: 10
      },
      canComment: false,
      isLook: true
    })
  },
  methods: {
    isOwner: () => true
  }
};
</script>
