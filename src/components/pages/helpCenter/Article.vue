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
              <router-link to="/support">Help Center</router-link>
              <a>{{ rootItem.title }}</a>
              <span>{{ item.title }}</span>
            </div>
          </div>
        </div>
        <div class="s-container support-content">
          <div class="container">
            <div class="cols">
              <div class="col col-1-4">
                <div class="questions-list">
                  <ul v-if="items && items.length">
                    <NodeTree
                      v-for="node in items"
                      :node="node"
                      :key="node.id"
                      :class="{ selected: selectedRootNodeId === node.id }"
                      :click="nodeClick"
                      :selectedRootId="selectedRootNodeId"
                      :level1Opened="!!selectedRootNodeId"
                      :level2Opened="level2Opened"
                    />
                  </ul>
                </div>
              </div>
              <div class="col col-3-4">
                <h3>{{ item.title }}</h3>
                <div v-html="item.description" class="support-text"></div>
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
import Loader from "@/components/common/Loader";

export default {
  name: "HelpCenterArticle",
  components: {
    ContentWrapper,
    NodeTree,
    Loader
  },
  data() {
    return {
      item: null,
      initialized: false,
      rootItem: {},
      selectedRootNodeId: null,
      level2Opened: false
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
      const item = this.findR(this.items, this.id);
      if (!item.rootId) {
        this.redirectToDeepestLeaf(item);
        return;
      }
      if (item) {
        this.rootItem = this.findR(this.items, item.rootId);
        this.item = item;
        this.initialized = true;
      }
    },
    findR(items, id, rootId) {
      for (let item of items) {
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
      }
      return null;
    },
    redirectToDeepestLeaf(item) {
      const deepestItem = this.findDeepestLeafR(item);
      this.$router.push("/support/article/" + deepestItem.id);
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
      console.log(level, id);
      if (level === 1) {
        if (this.selectedRootNodeId && this.selectedRootNodeId === id) {
          this.selectedRootNodeId = null;
          return;
        }
        this.selectedRootNodeId = id;
      } else if (level === 2) {
        this.level2Opened = true;
      }
    }
  }
};
</script>
