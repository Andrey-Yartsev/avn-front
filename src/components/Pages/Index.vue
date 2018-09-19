<template>
    <div class="feed">
        <nav class="header-nav hidden-desktop">
            <a class="menu-item-home active" href="/"><span>Home</span></a>
            <a class="menu-item-explore" href="/explore"><span>Explore</span></a>
            <a class="menu-item-notifications hidden-mobile btn-notifications unread" href="/notifications"><span>Notifications</span></a>
            <a class="menu-item-notifications hidden-desktop unread" href="/notifications"><span>Notifications</span></a>
            <a class="menu-item-messages showChat hidden-mobile" href="/chat"><span>Messages</span></a>
            <a class="menu-item-messages hidden-desktop" href="/chat"><span>Messages</span></a>
        </nav>
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
    import Footer from '../Footer/Index';
    import AddPost from '../AddPost/Index';
    import StoriesWrapper from '../Aside/StoriesWrapper';
    

    export default {
        name: 'Explore',
        components: {
            'Footer': Footer,
            'StoriesWrapper': StoriesWrapper,
            'AddPost': AddPost,
            'CollectionView': CollectionView,
        },
    }
</script>
