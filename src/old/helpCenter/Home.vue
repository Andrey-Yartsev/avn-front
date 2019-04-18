<template>
  <ContentWrapper>
    <template slot="content">
      <div class="s-container support-content">
        <div class="container">
          <div class="cols">
            <div class="col col-1-4">
              <div class="questions-list">
                <ul>
                  <li class="selected">
                    <span class="label">
                      Root first level111
                    </span>
                  </li>
                  <li>
                    <span class="label">
                      My account
                    </span>
                  </li>
                  <li>
                    <span class="label">
                      Fix a problem
                    </span>
                  </li>
                  <li>
                    <span class="label">
                      Policies and reporting
                    </span>
                  </li>
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
                            programs and in pop culture magazines, examining her
                            willingness to enter the world of hardcore porn at a
                            young age.
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
                          in pop culture magazines, examining her willingness to
                          enter the world of hardcore porn at a young age.
                        </p>
                        <p>
                          She has also been featured in movies, television
                          shows, music videos and advertising campaigns. She won
                          numerous awards for her work in pornography between
                          2007 and 2010, including the Female Performer of the
                          Year at the 2008 AVN Awards.
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
                          in mainstream media after appearing on several popular
                          television programs and in pop culture magazines,
                          examining her willingness to enter the world of
                          hardcore porn at a young age. She has also been
                          featured in movies, television shows, music videos and
                          advertising campaigns. She won numerous awards for her
                          work in pornography between 2007 and 2010, including
                          the Female Performer of the Year at the 2008 AVN
                          Awards.
                        </p>
                        <p>
                          After her feature film debut as the lead in the
                          Academy Award-winning director Steven Soderbergh's The
                          Girlfriend Experience (2009), Grey shifted her focus
                          to mainstream acting. She starred in the Canadian
                          black comedy horror film Smash Cut (2009) and played a
                          fictionalized version of herself in the seventh season
                          of the HBO comedy-drama series Entourage. She has also
                          appeared in independent films such as I Melt with You
                          and Open Windows. She is a former member of aTelecine,
                          an industrial music band.
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
            </div>
          </div>
        </div>
      </div>

      <!--
      <div class="s-container bg-gradient bg-gradient_light support-content">
        <div class="container">
          <div class="cols">
            <div class="col col-1-2 col_align-right">
              <div class="s-header">
                <div class="subtitle">NEW FEATURES</div>
                <h2>Make View.me your own</h2>
                <p>
                  Lorem ipsum dolor sit amet, sed diam nonummy nibh euismod
                  tincidunt
                </p>
                <a href="#" class="btn lg">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      -->

      <!--<div class="s-container support-content shadow-block">-->
      <!--<div class="container">-->
      <!--<div class="cols">-->
      <!--<div class="col col-1-2">-->
      <!--<div class="s-header">-->
      <!--<div class="subtitle">QUICK ANSWERS</div>-->
      <!--<h2>Trending Topics</h2>-->
      <!--<ul v-for="v in trending" :key="v.id">-->
      <!--<li>-->
      <!--<router-link :to="'/article/id' + v.id">{{-->
      <!--v.title-->
      <!--}}</router-link>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper";
import HeaderScrolled from "@/mixins/headerScrolled";

export default {
  mixins: [HeaderScrolled],
  components: {
    ContentWrapper
  },
  computed: {
    siteTitle() {
      return process.env.VUE_APP_TITLE;
    },
    sections() {
      return this.$store.state.support.items;
    },
    trending() {
      if (!this.$store.state.support.common) {
        return [];
      }
      return this.$store.state.support.common.trending;
    }
  },
  methods: {
    cssExists(icon) {
      return ["account", "problems", "reports"].indexOf(icon) !== -1;
    }
  }
};
</script>
