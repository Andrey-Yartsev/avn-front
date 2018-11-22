<template>
  <component :is="routedComponent"/>
</template>

<script>
import routes from "./routes";

export default {
  data() {
    return {
      routedComponent: null
    };
  },
  created() {
    // window.onhashchange = () => {
    //   console.log("onhashchange");
    //   if (!window.location.hash) {
    //     this.reset();
    //   } else {
    //     const route = this.matchRoute();
    //     if (!route) {
    //       return;
    //     }
    //     this.setComponent(route);
    //   }
    // };

    const route = this.matchRoute();
    if (!route) {
      return;
    }
    this.$store.commit("modalRouter/updateLoading", true);
    if (route.component.enterRedirect) {
      window.location = route.component.enterRedirect(route.params);
      return;
    }
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
      const routeData = {
        path: route.path,
        params: route.params
      };
      if (route.component._name) {
        routeData.name = route.component._name;
      }
      this.$store.commit("modalRouter/updateRoute", routeData);
      this.$store.commit("modalRouter/updatePath", route.path);
      this.$store.commit("modalRouter/updateParams", route.params);
      if (route.component.component) {
        this.routedComponent = route.component.component;
      } else {
        this.routedComponent = route.component;
      }
    },
    matchRoute() {
      const hash = window.location.hash.replace(/^#m\/(.*)/, "$1");
      const _routes = Object.entries(routes).map(v => {
        const pattern = v[0];
        const parts = pattern.split("/");
        const params = [];
        const regexp = parts
          .map((param, i) => {
            const match = param.match(/:([^/]+)/);
            if (match) {
              if (i === parts.length - 1) {
                // last param can contain "/"
                param = "(.+)";
              } else {
                param = "([^/]+)";
              }
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
      _routes.forEach(v => {
        if (found) {
          return;
        }
        const match = hash.match(new RegExp("^" + v.regexp + "$"));
        if (!match) {
          return;
        }
        const values = match.slice(1);
        const params = {};
        v.params.forEach((p, i) => {
          params[p] = values[i];
        });
        v.path = hash;
        v.params = params;
        found = v;
      });
      return found;
    }
  },
  render(createElement) {
    return createElement(this.routedComponent);
  }
};
</script>
