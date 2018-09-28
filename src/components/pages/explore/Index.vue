<template>
    <div class="exploreView">
        <MobileHeader></MobileHeader>
        <a class="addPost-btn-float hidden-desktop" href="/addPost"></a>
        <div class="container">
            <div class="over-container">
                <Navigate></Navigate>
                <div class="explore">
                    <div class="exploreAllCollectionView">
                        <div class="stories-all">
                            <div class="exploreAllStoriesCollectionView">
                                <div class="explore-stories">
                                    <div class="exploreAllStoriesView">
                                        <div class="explore-all-story">
                                            <a href="/stories/467140" class="avatar with-story"></a>
                                            <a href="/pulicapus" class="name">Андрей Багрянцев</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="explore-wrapper all">
                            <div class="photoView">
                                <a class="postLink" href="/post/242996">
                                    <figure>
                                        <img src="https://media.team2.retloko.com/files/n/nk/nkn/nknajsdwvmvwkq3qiblfke176w8jslmy1537186132/thumb.jpg">
                                        <span class="overlay">
                                            <span class="likes">1</span>
                                            <span class="comments">0</span>
                                        </span>
                                    </figure>
                                </a>
                            </div>
                            <div class="photoView">
                                <a class="postLink" href="/post/242989">
                                    <figure>
                                        <img src="https://media.team2.retloko.com/files/9/9o/9oi/9oi1iurejifirtpx4ury2sewbjp7mcws1536570046/thumb.jpg">
                                        <span class="overlay">
                                            <span class="likes">0</span>
                                            <span class="comments">0</span>
                                        </span>
                                    </figure>
                                </a>
                            </div>
                            <div class="photoView">
                                <a class="postLink" href="/post/242981">
                                    <figure>
                                        <img src="https://media.team2.retloko.com/files/8/85/85b/85bikue5l5emkwyhxrogjrjxwo1vz78i1536269087/thumb.jpg">
                                        <span class="overlay">
                                            <span class="likes">1</span>
                                            <span class="comments">0</span>
                                        </span>
                                    </figure>
                                </a>
                            </div>
                            <div class="photoView">
                                <a class="postLink" href="/post/242545">
                                    <figure>
                                        <img src="https://media.team2.retloko.com/files/c/cw/cw9/cw9h8kvkjoumhuejv68gc5vrxt2fiism1517415167/thumb.jpg">
                                        <span class="overlay">
                                            <span class="likes">1</span>
                                            <span class="comments">0</span>
                                        </span>
                                    </figure>
                                </a>
                            </div>
                        </div>
                        <div class="msg-no-content">
                            <div class="msg-no-content__text">No posts here yet</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MobileHeader from "../../header/Mobile";
import Navigate from "./common/Navigate";

export default {
  name: "Explore",
  components: {
    MobileHeader: MobileHeader,
    Navigate: Navigate
  }
};
</script>
