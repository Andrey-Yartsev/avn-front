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
                <div class="accordion-block">
                  <div class="accordion-section opened">
                    <div class="accordion-section__title">
                      Sasha Grey
                    </div>
                    <div class="accordion-section__body">
                      <div class="accordion-section__body-inside">
                        <div class="support-text">
                          <h3>Sasha Grey</h3>
                          <ol>
                            <li>
                              (born Marina Ann Hantzis; March 14, 1988) is an
                              <a>American actress</a>, model, and musician, and
                              former pornographic actress.
                            </li>
                            <li>She first made her name in mainstream media</li>
                          </ol>
                          <div class="support-message info">
                            Sasha Grey (born Marina Ann Hantzis; March 14, 1988)
                            is an American actress, model, and musician, and
                            former pornographic actress.
                          </div>
                          <h3>Sasha Grey</h3>
                          <ul>
                            <li>
                              after appearing on several popular television
                              programs and in pop culture magazines, examining
                              her willingness to enter the world of hardcore
                              porn at a young age.
                            </li>
                            <li>
                              She has also been featured in movies, television
                              shows, music videos and advertising campaigns. She
                              won numerous awards for her work in pornography
                              between 2007 and 2010, including the Female
                              Performer of the Year at the 2008 AVN Awards.
                            </li>
                          </ul>
                          <h3>Sasha Grey</h3>
                          <p>
                            first made her name in mainstream media after
                            appearing on several popular television programs and
                            in pop culture magazines, examining her willingness
                            to enter the world of hardcore porn at a young age.
                          </p>
                          <p>
                            She has also been featured in movies, television
                            shows, music videos and advertising campaigns. She
                            won numerous awards for her work in pornography
                            between 2007 and 2010, including the Female
                            Performer of the Year at the 2008 AVN Awards.
                          </p>
                        </div>
                        <div class="article-vote">
                          <div class="article-vote__header">
                            Was this article helpful?
                          </div>
                          <div class="article-vote__btns">
                            <span
                              role="button"
                              class="article-vote__btn vote-like"
                            ></span>
                            <span
                              role="button"
                              class="article-vote__btn vote-dislike"
                            ></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="accordion-section">
                    <div class="accordion-section__title">
                      How much is the fish? Article;
                    </div>
                    <div class="accordion-section__body">
                      <div class="accordion-section__body-inside">
                        <div class="support-text">
                          <p>
                            Sasha Grey (born Marina Ann Hantzis; March 14, 1988)
                            is an American actress, model, and musician, and
                            former pornographic actress. She first made her name
                            in mainstream media after appearing on several
                            popular television programs and in pop culture
                            magazines, examining her willingness to enter the
                            world of hardcore porn at a young age. She has also
                            been featured in movies, television shows, music
                            videos and advertising campaigns. She won numerous
                            awards for her work in pornography between 2007 and
                            2010, including the Female Performer of the Year at
                            the 2008 AVN Awards.
                          </p>
                          <p>
                            After her feature film debut as the lead in the
                            Academy Award-winning director Steven Soderbergh's
                            The Girlfriend Experience (2009), Grey shifted her
                            focus to mainstream acting. She starred in the
                            Canadian black comedy horror film Smash Cut (2009)
                            and played a fictionalized version of herself in the
                            seventh season of the HBO comedy-drama series
                            Entourage. She has also appeared in independent
                            films such as I Melt with You and Open Windows. She
                            is a former member of aTelecine, an industrial music
                            band.
                          </p>
                        </div>
                        <div class="article-vote">
                          <div class="article-vote__header">
                            Was this article helpful?
                          </div>
                          <div class="article-vote__btns">
                            <span
                              role="button"
                              class="article-vote__btn vote-like"
                            ></span>
                            <span
                              role="button"
                              class="article-vote__btn vote-dislike"
                            ></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!--<h3>{{ item.title }}</h3>-->
                <!--<div v-html="item.description" class="support-text"></div>-->
                <!--<Rate :articleId="id" v-if="user" />-->
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
