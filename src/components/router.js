import Vue from 'vue';
import VueRouter from 'vue-router';

import IndexPage from './Pages/Index';
import ExplorePage from './Pages/Explore/Index';
import ExploreStoriesPage from './Pages/Explore/Stories';
import ExploreVideosPage from './Pages/Explore/Videos';
import ExplorePhotosPage from './Pages/Explore/Photos';
import ExploreLivePage from './Pages/Explore/Live';
import MessagesPage from './Pages/Messages/Index';
import NatificationsPage from './Pages/Natifications/Index';

Vue.use(VueRouter);

const routes = [
    { path: '/', component: IndexPage },
    { path: '/explore', component: ExplorePage },
    { path: '/explore/stories', component: ExploreStoriesPage },
    { path: '/explore/photos', component: ExplorePhotosPage },
    { path: '/explore/live', component: ExploreLivePage },
    { path: '/explore/videos', component: ExploreVideosPage },
    { path: '/chat', component: MessagesPage },
    { path: '/notifications', component: NatificationsPage },
]

export default new VueRouter({
    mode: 'history',
    routes,
});
