const insertTextAtCursor = text => {
  let sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
  } else if (document.selection && document.selection.createRange) {
    document.selection.createRange().text = text;
  }
};

const htmlEntities = str => {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

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
        lookup: "name",
        fillAttr: "name",
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
          return item.original.name;
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
    this.$refs.textarea.addEventListener("paste", function(e) {
      e.preventDefault();
      if (e.clipboardData && e.clipboardData.getData) {
        let text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, htmlEntities(text));
      } else if (window.clipboardData && window.clipboardData.getData) {
        let text = window.clipboardData.getData("Text");
        insertTextAtCursor(text);
      }
    });

    this.$refs.textarea.addEventListener("keyup", this.checkLength);
    this.$refs.textarea.addEventListener("keydown", this.checkLength);
  },
  beforeDestroy() {
    this.$refs.textarea.removeEventListener("keyup", this.checkLength);
    this.$refs.textarea.removeEventListener("keydown", this.checkLength);
  }
};
