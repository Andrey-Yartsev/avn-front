<template>
    <div class="stories-wrapper">
        <div class="storyCollectionView">
            <h4>Stories</h4>
            <div class="stories-group">
                <div class="storyView create-story-button">
                    <div class="story">
                        <div class="story-avatar">
                            <a class="avatar new-story">
                                <img src="https://media.team2.retloko.com/files/f/fu/fuv/fuvehoth2zqjgua11c8akpdcxgr3dvvw1537170622/2afff3a23099780908097f84bc5da2fd_normal.jpeg">
                            </a>
                            <span class="btn-add"></span>
                        </div>
                        <div class="story-info">
                            <div class="name">Your story</div>
                            <div class="user-login">
                                <a class="new-story">Create new story</a>
                            </div>
                        </div>
                    </div>
                </div>
                <input class="hidden storyFileSelect" accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi" type="file">
                <div class="stories"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "StoriesWrapper"
};
</script>
