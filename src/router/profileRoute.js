// import ProfilePage from "@/components/pages/profile/NotFoundWrapper";
import Profile from "./profile";
const ProfilePage = () =>
  import(/* webpackChunkName: "ProfilePage" */ "@/components/pages/profile/NotFoundWrapper");
// const Profile = () => import(/* webpackChunkName: "Profile" */ "./profile");
// const StoryPage = () => import(/* webpackChunkName: "StoryPage" */ "@/components/pages/story/Index");

export default router => {
  router.addRoutes([
    {
      beforeEnter: Profile.init,
      name: "profile",
      path: "/:username/:page?",
      component: ProfilePage,
      meta: {
        cssName: "userProfile",
        profile: true
      }
    }
  ]);
};
