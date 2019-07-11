<template>
  <ContentWrapper>
    <template slot="content">
      <Loader v-if="loading" :fullscreen="false" text="" class="small" />
      <div v-else class="s-container support-content">
        <div class="container">
          <div class="cols">
            <div class="col col-1-4">
              <div class="questions-list">
                <ul>
                  <li
                    :class="{ selected: currentSection.id === v.id }"
                    v-for="v in sections"
                    :key="v.id"
                    @click="selectSection(v.id)"
                  >
                    <span class="label">
                      {{ v.title }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col col-3-4">
              <AccordionsTree :subSections="subSections" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper";
import HeaderScrolled from "@/mixins/headerScrolled";
import Loader from "@/components/common/Loader";
import AccordionsTree from "./AccordionsTree";

export default {
  mixins: [HeaderScrolled],
  components: {
    ContentWrapper,
    Loader,
    AccordionsTree
  },
  computed: {
    loading() {
      return this.$store.state.support.fetchLoading;
    },
    sections() {
      return this.$store.state.support.items;
    },
    currentSection() {
      if (!this.$store.state.support.items) {
        return [];
      }
      if (this.$route.params.id) {
        const paramId = parseInt(this.$route.params.id);
        const foundSection = this.$store.state.support.items.find(v => {
          return v.id === paramId;
        });
        if (!foundSection) {
          return this.$store.state.support.items[0];
        }
        return foundSection;
      }
      return this.$store.state.support.items[0];
    },
    subSections() {
      return this.currentSection.items;
    }
  },
  methods: {
    open(id, level) {
      this.$store.commit("support/accordion/open", {
        level,
        id
      });
    },
    selectSection(id) {
      this.$router.push(`/help/article/${id}`);
    },
    openR(sections, level) {
      this.open(sections[0].id, level);
      if (sections[0].items && sections[0].items.length) {
        this.openR(sections[0].items, level + 1);
      }
    }
  },
  watch: {
    subSections(subSections) {
      if (subSections && subSections.length) {
        this.openR(subSections, 0);
      }
    }
  }
};
</script>
