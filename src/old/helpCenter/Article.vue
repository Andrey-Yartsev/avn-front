<template>
  <ContentWrapper>
    <template slot="content">
      <Loader
        :fullscreen="false"
        text=""
        class="not-fullscreen transparent small"
        v-if="loading"
      />
      <template v-else>
        <div class="s-breadcrumbs">
          <div class="container">
            <div class="breadcrumbs" v-if="rootItem">
              <router-link to="/help" class="breadcrumbs__item"
                >Help Center</router-link
              >
              <span class="breadcrumbs__item">{{ rootItem.title }}</span>
              <span class="breadcrumbs__item current">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <div class="s-container support-content shadow-block">
          <div class="container">
            <div class="cols">
              <div class="col col-1-4">
                <div class="questions-list">
                  <ul
                    v-if="items && items.length"
                    :class="{ opened: level2Opened }"
                  >
                    <NodeTree
                      v-for="node in items"
                      :node="node"
                      :key="node.id"
                      :class="{ selected: selectedRootNodeId === node.id }"
                      :click="nodeClick"
                      :selectedRootId="selectedRootNodeId"
                    />
                  </ul>
                </div>
              </div>
              <div class="col col-3-4">
                <h3>{{ item.title }}</h3>
                <div v-html="item.description" class="support-text"></div>
                <Rate :articleId="id" v-if="user" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper";
import NodeTree from "./NodeTree";
import Rate from "./Rate";
import Loader from "@/components/common/Loader";
import HeaderScrolled from "@/mixins/headerScrolled";
import User from "@/mixins/user";

export default {
  name: "HelpCenterArticle",
  mixins: [HeaderScrolled, User],
  components: {
    ContentWrapper,
    NodeTree,
    Rate,
    Loader
  },
  data() {
    return {
      item: null,
      initialized: false,
      rootItem: {},
      selectedRootNodeId: null,
      pathItems: [],
      storePath: false
    };
  },
  computed: {
    fetchLoading() {
      return this.$store.state.support.fetchLoading;
    },
    loading() {
      return this.fetchLoading || !this.initialized;
    },
    items() {
      return this.$store.state.support.items;
    },
    id() {
      return parseInt(this.$route.params.id);
    },
    searchText() {
      return this.$store.state.support.searchText;
    },
    level1Opened() {
      return this.$store.state.support.menu.level1Opened;
    },
    level2Opened() {
      return this.$store.state.support.menu.level2Opened;
    }
  },
  watch: {
    searchText(searchText) {
      this.search(searchText);
    },
    id() {
      this.init();
    },
    fetchLoading: {
      immediate: true,
      handler(loading) {
        if (loading) {
          return;
        }
        this.init();
      }
    }
  },
  methods: {
    init() {
      this.initialized = false;
      const item = this.findCurrentItem();
      if (!item.rootId) {
        this.redirectToDeepestLeaf(item);
        return;
      }
      if (item) {
        this.rootItem = this.findR(this.items, item.rootId);
        this.item = item;
        this.initialized = true;
        this.initMenuState();
      }
    },
    findCurrentItem() {
      this.storePath = true;
      this.pathItems = [];
      const item = this.findR(this.items, this.id);
      this.storePath = false;
      return item;
    },
    findR(items, id, rootId) {
      for (let item of items) {
        if (this.storePath) {
          this.pathItems.push(item);
        }
        if (item.id === id) {
          item.rootId = rootId || null;
          return item;
        }
        let _rootId;
        if (item.items && item.items.length) {
          if (!rootId) {
            _rootId = item.id;
          } else {
            _rootId = rootId;
          }
          let r = this.findR(item.items, id, _rootId);
          if (r) {
            return r;
          }
        }
        if (this.storePath) {
          this.pathItems.pop();
        }
      }
      return null;
    },
    redirectToDeepestLeaf(item) {
      const deepestItem = this.findDeepestLeafR(item);
      this.$router.replace("/help/article/" + deepestItem.id);
    },
    findDeepestLeafR(item) {
      if (!item.items || !item.items.length) {
        return item;
      }
      for (let _item of item.items) {
        let r = this.findDeepestLeafR(_item);
        if (r) {
          return r;
        }
      }
    },
    nodeClick({ level, id }) {
      if (level === 1) {
        this.$store.commit("support/menu/setOpened", {
          level: 3,
          opened: false
        });
        this.$store.commit("support/menu/setOpened", {
          level: 2,
          opened: false
        });
        if (this.selectedRootNodeId && this.selectedRootNodeId === id) {
          this.$store.commit("support/menu/setOpened", {
            level: 1,
            opened: false
          });
          this.selectedRootNodeId = null;
          return;
        }
        this.$store.commit("support/menu/setOpened", {
          level: 1,
          opened: true
        });
        this.selectedRootNodeId = id;
      } else if (level === 2 || level === 3) {
        this.$store.commit("support/menu/setOpened", {
          level,
          opened: id
        });
      } else if (level === 4) {
        this.$router.push("/help/article/" + id);
      }
    },
    initMenuState() {
      this.selectedRootNodeId = this.rootItem.id;

      this.$store.commit("support/menu/setOpened", {
        level: 1,
        opened: true
      });
      this.$store.commit("support/menu/setOpened", {
        level: 2,
        opened: this.pathItems[1].id
      });
      this.$store.commit("support/menu/setOpened", {
        level: 3,
        opened: this.pathItems[2].id
      });
    }
  }
};
</script>
