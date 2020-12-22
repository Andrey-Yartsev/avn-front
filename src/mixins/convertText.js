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
      return convertedText.replace(/(<([^>]+)>)/gi, "");
    }
  }
};
