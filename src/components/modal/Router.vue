<template>
  <component :is="routedComponent"/>
</template>

<script>
import PostModal from "@/components/post/ModalView";

const routes = {
  "post/:postId/:from": {
    component: PostModal,
    enterRedirect: params => {
      return "/post/" + params.postId;
    }
  }
};

export default {
  data() {
    return {
      routedComponent: null
    };
  },
  created() {
    window.onhashchange = () => {
      if (!window.location.hash) {
        this.reset();
      } else {
        const route = this.matchRoute();
        if (!route) {
          return;
        }
        this.setComponent(route);
      }
    };
    const route = this.matchRoute();
    if (!route) {
      return;
    }
    this.$store.commit("modalRouter/updateLoading", true);
    if (route.component.enterRedirect) {
      window.location = route.component.enterRedirect(route.params);
      return;
    }
    this.setComponent(route);
    this.$store.commit("modalRouter/updateLoading", false);
  },
  watch: {
    ["$route"](route) {
      if (route.hash) {
        this.initComponent();
      } else {
        this.reset();
      }
    }
  },
  methods: {
    reset() {
      this.$store.commit("modalRouter/updatePath", null);
      this.$store.commit("modalRouter/updateParams", null);
      this.routedComponent = null;
    },
    initComponent() {
      const route = this.matchRoute();
      if (!route) {
        return;
      }
      this.setComponent(route);
    },
    setComponent(route) {
      this.$store.commit("modalRouter/updateParams", route.params);
      if (route.component.component) {
        this.routedComponent = route.component.component;
      } else {
        this.routedComponent = route.component;
      }
    },
    matchRoute() {
      const hash = window.location.hash.replace(/#m\/(.*)/, "$1");
      const r = Object.entries(routes).map(v => {
        const pattern = v[0];
        const parts = pattern.split("/");
        const params = [];
        const regexp = parts
          .map(param => {
            const match = param.match(/:([^/]+)/);
            if (match) {
              param = "([^/]+)";
              params.push(match[1]);
            }
            return param;
          })
          .join("/");
        return {
          pattern: v[0],
          params,
          regexp,
          component: v[1]
        };
      });
      let found = null;
      r.forEach(v => {
        const match = hash.match(new RegExp(v.regexp));
        if (!match) {
          return;
        }
        const values = match.slice(1);
        if (match) {
          const params = {};
          v.params.forEach((p, i) => {
            params[p] = values[i];
          });
          v.params = params;
          found = v;
        }
      });
      return found;
    }
  },
  render(createElement) {
    return createElement(this.routedComponent);
  }
};
</script>
