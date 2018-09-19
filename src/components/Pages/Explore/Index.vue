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
    import MobileHeader from '../../Header/Mobile';
    import Navigate from './common/Navigate';
    
    export default {
        name: 'Explore',
        components: {
            'MobileHeader': MobileHeader,
            'Navigate': Navigate,
        }
    }
</script>

<style scoped>
    @media (max-width: 992px) {
        #content {
            min-height: calc(100% - 44px);
            height: auto;
            display: flex;
            flex-direction: row;
            align-content: stretch;
            align-items: stretch;
        }
    }
    
    @media (max-width: 992px) {
        #site_header .header-logo,
        #site_header .make-post-btn {
            display: none;
        }
    }
    
    #site_header .guest .header-logo {
        margin-left: 0;
    }
    
    @media (max-width: 992px) {
        #site_header .guest .header-logo {
            display: flex;
        }
    }
    
    @media (max-width: 992px) {
        #site_header .header-search {
            display: flex;
        }
    }
    
    @media (max-width: 992px) {
        .explore-nav {
            line-height: 4em;
            display: flex;
            justify-content: space-around;
        }
    }
    
    @media (min-width: 992px) {
        .explore-nav {
            font-size: 17px;
            margin: -4px 0 24px;
            padding: 0 5px 8px;
            border-bottom: 1px solid rgba(124, 139, 150, 0.2);
        }
    }
    
    .explore-nav>a {
        color: var(--secondary-color);
        display: inline-block;
        margin: 0 1.5em 0 0;
        transition: color .3s ease;
    }
    
    @media (max-width: 992px) {
        .explore-nav>a {
            margin: 0;
        }
    }
    
    .explore-nav>a.active,
    .explore-nav>a:hover {
        color: var(--dark);
    }
    
    .explore-nav>a.active {
        font-weight: 500;
    }
    
    .all {
        display: flex;
        flex-wrap: wrap;
        margin-left: -3px;
        align-items: flex-start;
        align-content: flex-start;
    }
    
    @media (max-width: 992px) {
        .all {
            background: var(--light);
            overflow: hidden;
            padding: 3px 0 0;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
    }
    
    @media (min-width: 992px) {
        .all {
            margin-left: -30px;
        }
    }
    
    .all .exploreAllView {
        width: calc(33.33% - 3px);
        margin: 0 0 3px 3px;
        position: relative;
        cursor: pointer;
        overflow: hidden;
    }
    
    @media (min-width: 992px) {
        .all .exploreAllView {
            width: calc(33.33% - 30px);
            margin: 0 0 30px 30px;
        }
    }
    
    .all .exploreAllView img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    @media (max-width: 992px) {
        .exploreView {
            width: 100%;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: stretch;
        }
    }
    
    @media (max-width: 992px) {
        .exploreView .container {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: row;
        }
    }
    
    @media (max-width: 992px) {
        .exploreView .over-container {
            width: calc(100% + 30px);
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: stretch;
        }
    }
    
    @media (max-width: 992px) {
        .explore {
            min-height: calc(100% - 60px);
            flex: 1;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: stretch;
        }
    }
    
    @media (max-width: 992px) {
        .explore>div {
            flex: 1;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: stretch;
            align-items: stretch;
            align-content: stretch;
            position: relative;
        }
    }
    
    @media (max-width: 992px) {
        .explore-wrapper {
            min-height: calc(100% - 60px);
            background: var(--light);
            overflow: hidden;
            padding: 3px 0 0;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            position: relative;
            flex: 1;
        }
    }
    
    .profile .explore-wrapper:empty {
        display: none;
    }
    
    .explore .all:empty+.msg-no-content,
    .explore .stories:empty+.msg-no-content,
    .explore .videos:empty+.msg-no-content,
    .explore .photos:empty+.msg-no-content,
    .explore .lives:empty+.msg-no-content {
        pointer-events: auto;
        opacity: 1;
    }
</style>

<style scoped>
    .photos {
        display: flex;
        flex-wrap: wrap;
        margin-left: -3px;
        align-content: flex-start;
        align-items: flex-start;
    }
    
    @media (max-width: 992px) {
        .photos {
            overflow: hidden;
        }
        .posts-container .photos {
            box-shadow: none;
        }
    }
    
    @media (min-width: 992px) {
        .photos {
            margin-left: -30px;
        }
    }
    
    @media (max-width: 992px) {
        .container>.photoCollectionView {
            margin: 0 -15px;
        }
    }
    
    .photoView {
        width: calc(33.33% - 3px);
        margin: 0 0 3px 3px;
    }
    
    @media (min-width: 992px) {
        .photoView {
            width: calc(33.33% - 30px);
            margin: 0 0 30px 30px;
        }
    }
    
    .photoView figure {
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 100%;
    }
    
    .photoView figure:after {
        pointer-events: none;
        content: '';
        display: block;
        padding-top: 100%;
        height: 0;
    }
    
    @media (min-width: 992px) {
        .photoView figure:before {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.4);
            opacity: 0;
            transform: scale(0);
            z-index: 1;
            content: '';
            transition: opacity .3s ease, transform .3s ease;
        }
        .photoView figure:hover:before,
        .photoView figure:hover .overlay {
            opacity: 1;
            transform: scale(1);
        }
        .photoView figure:hover .count .value {
            opacity: 1;
        }
    }
    
    .photoView .postLink {
        display: block;
        width: 100%;
        height: 100%;
    }
    
    .photoView img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
    }
    
    @media (max-width: 992px) {
        .photoView .overlay {
            display: none;
        }
    }
    
    @media (min-width: 992px) {
        .photoView .overlay {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            opacity: 0;
            transform: scale(5);
            transition: opacity .3s ease, transform .3s ease;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: space-around;
            color: #fff;
            font-weight: 500;
            padding: 0 18%;
            z-index: 1;
        }
        .photoView .overlay .likes:before,
        .photoView .overlay .comments:before {
            font-family: team;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: center;
            font-size: 24px;
            line-height: 0;
            vertical-align: middle;
            font-weight: 400;
            margin-right: 5px;
        }
        .photoView .overlay .likes:before {
            content: '\E616';
        }
        .photoView .overlay .comments:before {
            content: '\E617';
        }
    }
    
    .photoView .count {
        position: absolute;
        right: 5px;
        top: 3px;
        color: #fff;
        opacity: .7;
        pointer-events: none;
        display: inline-flex;
        align-items: center;
        z-index: 2;
    }
    
    @media (min-width: 992px) {
        .photoView .count {
            right: 15px;
            top: 12px;
        }
    }
    
    .photoView .count .value {
        font-weight: 500;
        margin-right: 5px;
        opacity: 0;
        transition: opacity .3s ease;
    }
    
    .photoView .count:after {
        content: '\E634';
        font-size: 18px;
        font-family: team;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }
    
    @media (min-width: 992px) {
        .photoView .count:after {
            font-size: 24px;
        }
    }
    
    .photoView .locked-picture {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
</style>
    
<style scoped>
    @media (min-width: 992px) {
        .videos {
            display: flex;
            flex-wrap: wrap;
            margin-left: -30px;
        }
    }
    
    @media (min-width: 992px) {
        .videoCollectionView {
            padding: 0 4px;
        }
    }
    
    @media (max-width: 992px) {
        .container .videoCollectionView .shadow-block {
            background: var(--light);
            overflow: hidden;
            box-shadow: 0 -3px 5px rgba(0, 0, 0, 0.08);
        }
    }
    
    @media (max-width: 992px) {
        .videoView {
            padding: 0 0 8px;
            border-bottom: 1px solid rgba(124, 139, 150, 0.2);
            background: var(--white);
        }
    }
    
    @media (min-width: 992px) {
        .videoView {
            overflow: hidden;
            cursor: pointer;
            width: calc(33.33% - 30px);
            margin: 0 0 30px 30px;
        }
        .videoView figure {
            position: relative;
        }
        .videoView figure:after {
            pointer-events: none;
            content: '';
            display: block;
            padding-top: 100%;
            height: 0;
        }
        .videoView figure img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
        }
        .videoView figure .duration {
            position: absolute;
            right: 5px;
            top: 3px;
            color: #fff;
            opacity: .7;
            pointer-events: none;
            display: inline-flex;
            align-items: center;
            z-index: 2;
        }
    }
    
    @media (min-width: 992px) and (min-width: 992px) {
        .videoView figure .duration {
            right: 15px;
            top: 12px;
        }
    }
    
    @media (min-width: 992px) {
        .videoView figure .duration:after {
            font-size: 18px;
            content: '\E635';
            font-family: team;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: center;
        }
    }
    
    @media (min-width: 992px) and (min-width: 992px) {
        .videoView figure .duration:after {
            font-size: 24px;
        }
    }
    
    @media (min-width: 992px) {
        .videoView figure .duration .value {
            font-weight: 500;
            opacity: 0;
            transition: opacity .3s ease;
            margin: 0 5px 0 0;
        }
    }
    
    @media (min-width: 992px) and (max-width: 992px) {
        .videoView figure .overlay {
            display: none;
        }
    }
    
    @media (min-width: 992px) and (min-width: 992px) {
        .videoView figure .overlay {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            opacity: 0;
            transform: scale(5);
            transition: opacity .3s ease, transform .3s ease;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: space-around;
            color: #fff;
            font-weight: 500;
            padding: 0 18%;
            z-index: 1;
        }
        .videoView figure .overlay .likes:before,
        .videoView figure .overlay .comments:before {
            font-family: team;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: center;
            font-size: 24px;
            line-height: 0;
            vertical-align: middle;
            font-weight: 400;
            margin-right: 5px;
        }
        .videoView figure .overlay .likes:before {
            content: '\E616';
        }
        .videoView figure .overlay .comments:before {
            content: '\E617';
        }
    }
    
    @media (min-width: 992px) {
        .videoView figure:before {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.4);
            opacity: 0;
            transform: scale(0);
            content: '';
            z-index: 1;
            transition: opacity .3s ease, transform .3s ease;
        }
        .videoView figure:hover:before,
        .videoView figure:hover .overlay {
            opacity: 1;
            transform: scale(1);
        }
        .videoView figure:hover .duration .value {
            opacity: 1;
        }
        .videoView figure .locked-picture {
            position: initial;
        }
    }
    
    .videoView .date {
        padding-left: 15px;
    }
</style>
    
<style scoped>
    .stories {
        display: flex;
        flex-wrap: wrap;
        margin-left: -3px;
    }
    
    @media (max-width: 992px) {
        .stories {
            background: var(--light);
            overflow: hidden;
            padding: 3px 0 0;
            box-shadow: 0 -3px 5px rgba(0, 0, 0, 0.08);
            min-height: calc(100vh - 148px);
            align-items: flex-start;
            align-content: flex-start;
        }
    }
    
    @media (min-width: 992px) {
        .stories {
            margin: 0 -10px;
        }
    }
    
    .storyView {
        background: var(--white);
        margin: 0 0 2px 3px;
        position: relative;
        cursor: pointer;
        text-align: center;
        box-shadow: none;
        transition: box-shadow .3s ease;
        width: calc(33.3% - 3px);
    }
    
    @media (min-width: 992px) {
        .storyView {
            width: calc(25% - 30px);
            margin: 0 15px 33px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }
    }
    
    .storyView a {
        display: block;
        padding: 0 0 8%;
        color: var(--dark);
    }
    
    @media (min-width: 992px) {
        .storyView a {
            padding: 0 0 19px;
        }
    }
    
    .storyView img {
        width: 100%;
    }
    
    .storyView .story-preview {
        position: relative;
        margin: 0 0 77px;
        padding-top: 100%;
        height: 0;
    }
    
    @media (max-width: 992px) {
        .storyView .story-preview {
            margin-bottom: 42%;
        }
    }
    
    .storyView .story-preview img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .storyView .avatar {
        font-size: 18.67vw;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 50%);
    }
    
    @media (min-width: 992px) {
        .storyView .avatar {
            font-size: 100px;
            bottom: -2px;
        }
    }
    
    .storyView .avatar:not(:empty):before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        border-radius: 1000px;
        background: var(--white);
    }
    
    .storyView .story-header {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        margin-bottom: 4px;
    }
    
    @media (min-width: 992px) {
        .storyView .story-header {
            margin-bottom: 8px;
        }
    }
    
    @media (max-width: 992px) {
        .storyView .story-header .verified-user {
            width: 12px;
            height: 12px;
            line-height: 12px;
            font-size: 12px;
            margin-top: -1px;
            margin-left: 3px;
        }
    }
    
    .storyView .name {
        max-width: 80%;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    @media (max-width: 992px) {
        .storyView .name {
            font-size: 11px;
        }
    }
    
    .storyView .user-login {
        display: block;
        padding: 0 6px;
        font-size: 15px;
        margin-left: 0;
    }
    
    @media (max-width: 992px) {
        .storyView .user-login {
            font-size: 11px;
        }
    }
    
    @media (max-width: 992px) {
        .exploreAllStoriesCollectionView {
            margin: 0 15px;
            border-top: 1px solid rgba(124, 139, 150, 0.2);
        }
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView {
            margin: -5px 0 16px;
        }
    }
    
    .exploreAllStoriesCollectionView .explore-stories {
        display: flex;
        overflow: hidden;
        padding: 15px 15px 0;
    }
    
    @media (max-width: 992px) {
        .exploreAllStoriesCollectionView .explore-stories {
            margin: 0 -15px;
            overflow-x: scroll;
            -webkit-overflow-scrolling: touch;
        }
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView .explore-stories {
            padding: 5px 5px 0;
        }
    }
    
    .exploreAllStoriesCollectionView .explore-stories:empty {
        display: none;
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView {
        width: 60px;
        min-width: 60px;
        margin-right: 23px;
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView .exploreAllStoriesView {
            width: 82px;
            min-width: 82px;
            margin-right: 24px;
        }
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView .avatar {
        margin: 0 auto;
        font-size: 50px;
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView .exploreAllStoriesView .avatar {
            font-size: 70px;
        }
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView .avatar:before {
        box-shadow: 0 0 0 3px var(--white);
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView .avatar:not(:empty):before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        border-radius: 1000px;
        background: var(--white);
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView .name {
        text-align: center;
        font-size: 13px;
        margin: 10px 0 8px;
        font-weight: 400;
        display: block;
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView .exploreAllStoriesView .name {
            margin: 13px 0 5px;
        }
    }
</style>

<style scoped>
    .stories {
        display: flex;
        flex-wrap: wrap;
        margin-left: -3px;
    }
    
    @media (max-width: 992px) {
        .stories {
            background: var(--light);
            overflow: hidden;
            padding: 3px 0 0;
            box-shadow: 0 -3px 5px rgba(0, 0, 0, 0.08);
            min-height: calc(100vh - 148px);
            align-items: flex-start;
            align-content: flex-start;
        }
    }
    
    @media (min-width: 992px) {
        .stories {
            margin: 0 -10px;
        }
    }
    
    .storyView {
        background: var(--white);
        margin: 0 0 2px 3px;
        position: relative;
        cursor: pointer;
        text-align: center;
        box-shadow: none;
        transition: box-shadow .3s ease;
        width: calc(33.3% - 3px);
    }
    
    @media (min-width: 992px) {
        .storyView {
            width: calc(25% - 30px);
            margin: 0 15px 33px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }
    }
    
    .storyView a {
        display: block;
        padding: 0 0 8%;
        color: var(--dark);
    }
    
    @media (min-width: 992px) {
        .storyView a {
            padding: 0 0 19px;
        }
    }
    
    .storyView img {
        width: 100%;
    }
    
    .storyView .story-preview {
        position: relative;
        margin: 0 0 77px;
        padding-top: 100%;
        height: 0;
    }
    
    @media (max-width: 992px) {
        .storyView .story-preview {
            margin-bottom: 42%;
        }
    }
    
    .storyView .story-preview img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .storyView .avatar {
        font-size: 18.67vw;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 50%);
    }
    
    @media (min-width: 992px) {
        .storyView .avatar {
            font-size: 100px;
            bottom: -2px;
        }
    }
    
    .storyView .avatar:not(:empty):before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        border-radius: 1000px;
        background: var(--white);
    }
    
    .storyView .story-header {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        margin-bottom: 4px;
    }
    
    @media (min-width: 992px) {
        .storyView .story-header {
            margin-bottom: 8px;
        }
    }
    
    @media (max-width: 992px) {
        .storyView .story-header .verified-user {
            width: 12px;
            height: 12px;
            line-height: 12px;
            font-size: 12px;
            margin-top: -1px;
            margin-left: 3px;
        }
    }
    
    .storyView .name {
        max-width: 80%;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    @media (max-width: 992px) {
        .storyView .name {
            font-size: 11px;
        }
    }
    
    .storyView .user-login {
        display: block;
        padding: 0 6px;
        font-size: 15px;
        margin-left: 0;
    }
    
    @media (max-width: 992px) {
        .storyView .user-login {
            font-size: 11px;
        }
    }
    
    @media (max-width: 992px) {
        .exploreAllStoriesCollectionView {
            margin: 0 15px;
            border-top: 1px solid rgba(124, 139, 150, 0.2);
        }
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView {
            margin: -5px 0 16px;
        }
    }
    
    .exploreAllStoriesCollectionView .explore-stories {
        display: flex;
        overflow: hidden;
        padding: 15px 15px 0;
    }
    
    @media (max-width: 992px) {
        .exploreAllStoriesCollectionView .explore-stories {
            margin: 0 -15px;
            overflow-x: scroll;
            -webkit-overflow-scrolling: touch;
        }
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView .explore-stories {
            padding: 5px 5px 0;
        }
    }
    
    .exploreAllStoriesCollectionView .explore-stories:empty {
        display: none;
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView {
        width: 60px;
        min-width: 60px;
        margin-right: 23px;
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView .exploreAllStoriesView {
            width: 82px;
            min-width: 82px;
            margin-right: 24px;
        }
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView .avatar {
        margin: 0 auto;
        font-size: 50px;
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView .exploreAllStoriesView .avatar {
            font-size: 70px;
        }
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView .avatar:before {
        box-shadow: 0 0 0 3px var(--white);
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView .avatar:not(:empty):before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        border-radius: 1000px;
        background: var(--white);
    }
    
    .exploreAllStoriesCollectionView .exploreAllStoriesView .name {
        text-align: center;
        font-size: 13px;
        margin: 10px 0 8px;
        font-weight: 400;
        display: block;
    }
    
    @media (min-width: 992px) {
        .exploreAllStoriesCollectionView .exploreAllStoriesView .name {
            margin: 13px 0 5px;
        }
    }
</style>



