export default {
  methods: {
    getConvertedText(text) {
      const pattern =
        '<span class="emoji-outer emoji-sizer"><span class="emoji-inner emoji.+?" data-code="(.+?)"></span></span>';
      let convertedText = text.replace(
        new RegExp(pattern, "ug"),
        (m, unicode) => {
          return unicode;
        }
      );
      convertedText = convertedText.replace(/<br \/>/g, "\n");
      convertedText = this.replaceTagToUsername(convertedText);
      return convertedText.replace(/(<([^>]+)>)/gi, "");
    },
    // replace user mentions - from <a data-login="user888" href="#">@some_namesdf</a> to <a data-login="user888" href="#">@user888</a>
    replaceTagToUsername(string) {
      if (!string || !string.length) {
        return "";
      }
      let convertedString = string;
      const keys = {};
      const tags = string.split("</a>");
      tags.forEach(item => {
        const username = item.match(/"{1}[^"]+"{1}/i);
        const name = item.match(/>@.+/i);
        if (username && name) {
          const key = name["0"].slice(1);
          const value = username["0"].slice(1, -1);
          keys[key] = value;
        }
      });
      for (let key in keys) {
        convertedString = convertedString.replace(key, `@${keys[key]}`);
      }
      return convertedString;
    }
  }
};
