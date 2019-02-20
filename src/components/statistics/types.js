const chartTypes = {
  posts: {
    new_post: ["Post", "posts", ["#FF3E33", "#FE3F8C"]],
    view_post: ["View", "views", ["#ff9500", "#ffcc00"]],
    post_like: ["Like", "likes", ["#67cc2e", "#b3f43a"]],
    post_comment_added: ["Comment", "comments", ["#3abfd3", "#49eeca"]]
  },
  stories: {
    story_added: ["Uploaded", "uploads"],
    story_view: ["Views", "views"]
  }
};
const periodTypes = [
  {
    name: "today",
    title: "Today",
    moment: null
  },
  {
    name: "last_week",
    title: "Last week",
    moment: "week"
  },
  {
    name: "last_month",
    title: "Last month",
    moment: "month"
  },
  {
    name: "last_year",
    title: "Last year",
    moment: "year"
  }
];

const getPeriodType = name => {
  return periodTypes.find(v => v.name === name);
};

const lineTypes = {};

Object.entries(chartTypes).forEach(v => {
  const vv = v[1];
  Object.entries(vv).forEach(w => {
    lineTypes[w[0]] = {
      chartType: v[0],
      title: w[1][0],
      dataProviderKey: w[1][1]
    };
  });
});

const periodTypeNames = periodTypes.map(v => v.name);

export { chartTypes, periodTypes, getPeriodType, lineTypes, periodTypeNames };
