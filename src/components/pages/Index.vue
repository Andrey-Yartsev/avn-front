<template>
    <div class="feed">
        <MobileHeader></MobileHeader>
        <a class="addPost-btn-float hidden-desktop" href="/addPost"></a>
        <div class="container">
            <div class="row">
                <div class="content-col">
                    <div class="rounded-container shadow-block no-padding">
                        <AddPost></AddPost>
                        <CollectionView></CollectionView>
                    </div>
                </div>
                <div class="aside-col aside-col_with-footer">
                    <StoriesWrapper></StoriesWrapper>
                    <Footer></Footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CollectionView from "../posts/CollectionView";
import MobileHeader from "../header/Mobile";
import Footer from "../footer/Index";
import AddPost from "../addPost/Index";
import StoriesWrapper from "../aside/StoriesWrapper";

export default {
  name: "Explore",
  components: {
    MobileHeader: MobileHeader,
    Footer: Footer,
    StoriesWrapper: StoriesWrapper,
    AddPost: AddPost,
    CollectionView: CollectionView
  }
};
</script>
