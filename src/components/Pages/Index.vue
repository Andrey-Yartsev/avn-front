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
    import CollectionView from '../Posts/CollectionView';
    import MobileHeader from '../Header/Mobile';
    import Footer from '../Footer/Index';
    import AddPost from '../AddPost/Index';
    import StoriesWrapper from '../Aside/StoriesWrapper';
    
    export default {
        name: 'Explore',
        components: {
            'MobileHeader': MobileHeader,
            'Footer': Footer,
            'StoriesWrapper': StoriesWrapper,
            'AddPost': AddPost,
            'CollectionView': CollectionView,
        },
    }
</script>
