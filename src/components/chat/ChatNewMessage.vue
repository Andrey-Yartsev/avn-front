<template>
  <ChatWrapper>
    <template slot="col1">
      <div class="chatHeader chatHeader_add-shadow">
        <div class="contactsListHeader">
          <div
            class="add-new-type add-new-type_underline-items add-new-type_b-with-text line-bottom chat-new-type hidden-mobile">
            <div class="addNewNav"><span class="new-post"><span class="add-new-type__text">Post</span></span>
              <span class="new-story"><span class="add-new-type__text">Story</span></span>
              <span class="new-live"><span class="add-new-type__text">Go live</span></span>
              <span class="new-message active"><span class="add-new-type__text">Message</span></span>
              <input type="file" class="hidden storyFileSelect"
                     accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"></div>
          </div>
          <div class="back-popup-btn">
            <span class="back backEvent hidden-mobile"></span>
            <a href="/chat" class="back hidden-desktop">
              <span class="hidden-desktop">New message</span>
            </a>
          </div>
          <button class="nextStep btn hidden-desktop" disabled="">Next</button>
        </div>
      </div>
      <div class="add-new-type add-new-type_underline-items line-bottom add-new-type_b-with-text hidden-desktop">
        <div class="addNewNav"><span class="new-post"><span class="add-new-type__text">Post</span></span>
          <span class="new-story"><span class="add-new-type__text">Story</span></span>
          <span class="new-live"><span class="add-new-type__text">Go live</span></span>
          <span class="new-message active"><span class="add-new-type__text">Message</span></span>
          <input type="file" class="hidden storyFileSelect"
                 accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"></div>
      </div>
      <div class="chatCollectionContentWrapper">
        <div
          class="searchChatContacts os-host os-theme-dark os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-scrollbar-vertical-hidden os-host-transition">
          <div class="os-resize-observer-host">
            <div class="os-resize-observer observed" style="left: 0px; right: auto;"></div>
          </div>
          <div class="os-size-auto-observer" style="height: calc(100% + 1px); float: left;">
            <div class="os-resize-observer observed"></div>
          </div>
          <div class="os-content-glue" style="margin: -15px -13px; width: 735px; height: 165px;"></div>
          <div class="os-padding">
            <div class="os-viewport os-viewport-native-scrollbars-invisible" style="">
              <div class="os-content" style="padding: 15px 13px; height: auto; width: 100%;">
                <div class="searchContact">
                  <div class="all-contacts-found">
                    <div class="selectedContacts"></div>
                    <div class="btn-selected-all visible"></div>
                  </div>
                  <div class="searchWrapper">
                    <span class="sendTo">To</span>
                    <input type="text" class="searchInput" placeholder="Search">
                  </div>
                </div>
                <div class="searchResult">

                  <div class="searchChatContactsView"><span class="avatar"></span>
                    <div class="chatView__header">
                      <span class="name">OnMyTeam.com Support</span>

                    </div>
                    <div class="user-login"><span class="username">support</span></div>
                    <span class="check"></span></div>
                  <div class="searchChatContactsView"><span class="avatar"><img
                    src="https://media.team2.retloko.com/files/g/gc/gc9/gc9hefqkkovpavebowto3zytfjtvz4ge1537782424/default_profile_normal.png"></span>
                    <div class="chatView__header">
                      <span class="name">masted</span>
                      <span class="verified-user"></span>
                    </div>
                    <div class="user-login"><span class="username">masted1433</span></div>
                    <span class="check"></span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="os-scrollbar os-scrollbar-horizontal os-scrollbar-unusable">
            <div class="os-scrollbar-track os-scrollbar-track-off">
              <div class="os-scrollbar-handle" style="width: 100%; transform: translate(0%, 0px);"></div>
            </div>
          </div>
          <div class="os-scrollbar os-scrollbar-vertical os-scrollbar-unusable">
            <div class="os-scrollbar-track os-scrollbar-track-off">
              <div class="os-scrollbar-handle" style="height: 100%; transform: translate(0px, 0%);"></div>
            </div>
          </div>
          <div class="os-scrollbar-corner"></div>
        </div>
      </div>

    </template>
    <template slot="col2">
      <div class="chatHeader chatHeader_add-shadow no-nav">
        <div class="selectedChatHeader">
          <div class="back-popup-btn hidden-desktop">
            <span class="back backEvent"></span>
          </div>
          <a class="avatar hidden"></a>
          <a class="name"></a>
          <span class="user-login"><a class="username"></a></span>
          <span class="mass-message hidden">Mass message</span>
          <span class="chatOptions hidden">
                    <span class="chatExpand"></span>
                    <div class="chatOptions__dropdown">
                        <ul class="chatOptions__list">
                            <li><a class="profile-url">View profile</a></li>
                            <li><a class="menu-cancel">Cancel</a></li>
                        </ul>
                    </div>
                </span>
        </div>
      </div>
      <div class="chatCollectionContentWrapper">
        <div class="chatMessagesCollectionView no-selected-conversation">
          <div class="chat-section">
            <div class="chatContent"></div>
            <div class="msg-no-chat">
              <div class="msg-no-chat__msg">Select people from your contacts</div>
              <div class="btn-start btn-selected-all">Select all</div>
            </div>
          </div>
          <div class="addChatMessage">
            <div class="addFileCollectionView"></div>
            <form class="chatForm">
              <label class="add-media-input btn-el"><input type="file"
                                                           accept=".jpg,.jpeg,.gif,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"></label>
              <button class="tips btn-el hidden"></button>
              <div class="field-text-message">
                <textarea class="text-media-container" rows="1" cols="60" placeholder="Message" maxlength="500"
                          style="overflow: hidden; overflow-wrap: break-word; height: 30px;"></textarea>
                <div class="price-message-wrapper"><span class="price-message"></span>
                  <button type="button" class="btn-clear-price"></button>
                </div>
              </div>
              <div class="chatTip hidden">
                <button class="cancel btn btn-cancel">Cancel</button>
                <div class="chatTip__field">
                  <input type="text" pattern="\d{1,3}(?:\.\d{0,2})?" maxlength="6" name="tipAmount" class="tipAmount"
                         placeholder="Enter tip amount">
                </div>
                <button class="sendTip btn">Send tip</button>
              </div>
              <div class="getPaidForm hidden">
                <button class="cancelPaid btn btn-cancel">Cancel</button>
                <input type="hidden" name="priceAmount" class="getPaidAmount">
                <div class="getPaidForm__field">
                  <input type="text" pattern="\d{1,3}(?:\.\d{0,2})?" maxlength="6" class="getPaidAmountPlaceholder"
                         placeholder="Enter price">
                </div>
                <button class="setPrice btn">Set Price</button>
              </div>
              <button class="getPaid btn-el hidden"></button>
              <!-- <label class="submit"><input type="submit" class="notVisible"/></label> -->
              <button type="submit" class="submit btn-el" disabled=""></button>
            </form>
          </div>
        </div>
      </div>
    </template>
  </ChatWrapper>
</template>

<script>
import userMixin from "@/mixins/user";
import ChatWrapper from "./ChatWrapper";

export default {
  name: "Chat",

  mixins: [userMixin],

  components: {
    ChatWrapper
  },

  computed: {
    noMessages() {
      return this.$route.params[1] && this.$route.params[1] === "no-messages";
    }
  },

  created() {
    this.$store.dispatch("chat/fetchChats");
  }
};
</script>
