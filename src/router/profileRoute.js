import ProfilePage from "@/components/pages/profile/NotFoundWrapper";
import Profile from "./profile";

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
