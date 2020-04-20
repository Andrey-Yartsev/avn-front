export default {
  data() {
    return {
      maxLength: 1000
    };
  },
  computed: {
    tributeOptions() {
      const obj = this;
      return {
        values: this.usersSearch,
        lookup: el => {
          return el.name + "|" + el.username;
        },
        fillAttr: "name",
        noMatchTemplate: function() {
          return "<span class='no-results'>nothing found</span>";
        },
        selectTemplate: function(item) {
          if (typeof item === "undefined") {
            return null;
          }
          if (obj.textInput) {
            setTimeout(function() {
              obj.textInput();
            }, 100);
          }
          if (this.range.isContentEditable(obj.$refs.textarea)) {
            return (
              '<span contenteditable="false"><a>' +
              "@" +
              item.original.username +
              "</a></span>"
            );
          }
          return "@" + item.original.username;
        },
        menuItemTemplate: function(item) {
          let template = ``;
          template += `<span contenteditable="false">
<a tabindex="2" class="user">
  <span class="avatar avatar_gap-r-sm avatar_sm">
    <span class="avatar__img">`;
          if (item.original.avatar) {
            template += `<img src="${item.original.avatar}">`;
          }
          template += `</span>`;
          template += `
  </span>
  <div class="username-group">
    <div class="user__name">
      <div class="name">${item.original.name}</div>`;
          if (item.original.isVerified) {
            template += `<span class="verified-user icn-item"></span>`;
          }
          template += `</div>
    <span class="user-login reset-ml">${item.original.username}</span>
  </div>
</a>
</span>
`;
          return template;
        }
      };
    }
  },
  methods: {
    usersSearch(text, cb) {
      this.$store.dispatch("search/tribute/search", text).then(result => {
        cb(result.list);
      });
    },
    checkLength(e) {
      if (
        e.which !== 8 &&
        this.$refs.textarea.innerText.length > this.maxLength
      ) {
        e.preventDefault();
      }
    }
  },
  mounted() {
    this.$refs.textarea.addEventListener("keyup", this.checkLength);
    this.$refs.textarea.addEventListener("keydown", this.checkLength);
  },
  beforeDestroy() {
    this.$refs.textarea.removeEventListener("keyup", this.checkLength);
    this.$refs.textarea.removeEventListener("keydown", this.checkLength);
  }
};
