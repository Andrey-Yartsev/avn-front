import moment from "moment";

const chartTypes = {
  followers: {
    current_followers: ["Followers", "followers"],
    current_subscribers: ["Subscribers", "subscribers"]
  },
  posts: {
    new_post: ["Post", "posts", ["#FF3E33", "#FE3F8C"]],
    view_post: ["View", "views", ["#ff9500", "#ffcc00"]],
    post_like: ["Like", "likes", ["#67cc2e", "#b3f43a"], "total"],
    post_comment_added: ["Comment", "comments", ["#3abfd3", "#49eeca"]]
  },
  stories: {
    story_added: ["Uploads", "uploads"],
    story_view: ["Views", "views"]
  },
  earnings: {
    paid_subscriptions: ["Subscriber", "paid_subscriptions", [], "total", "$"],
    tips: ["Tip", "tips", [], "total", "$"],
    paid_chat_messages: ["Message", "paid_chat_messages", [], "total", "$"],
    earn_referral: ["Referral", "earn_referral", [], "total", "$"]
  }
};
const periodTypes = [
  {
    name: "daily",
    title: "Daily",
    moment: "month"
  },
  {
    name: "weekly",
    title: "Weekly",
    moment: "week"
  },
  {
    name: "today",
    title: "Today",
    moment: null
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
const chartDataSets = {};

Object.entries(chartTypes).forEach(v => {
  const [chartType, _lineTypes] = v;
  chartDataSets[chartType + "_chart"] = {};
  Object.entries(_lineTypes).forEach(lineType => {
    const [lineKey, lineData] = lineType;
    lineTypes[lineKey] = {
      chartType: chartType,
      title: lineData[0],
      dataProviderKey: lineData[1],
      countSubKey: lineData[3],
      countPostfix: lineData[4] || undefined
    };
  });
});

const periodTypeNames = periodTypes.map(v => v.name);

const getScaleData = period => {
  const now = moment()
    .utc()
    .unix();

  let periodType, count;
  let startDate = now;

  switch (period) {
    case "today":
      count = 1439;
      periodType = "minutes";
      // format = "YYYY-MM-DD HH:mm";
      startDate = moment(
        moment
          .unix(now)
          .add(1, "d")
          .format("YYYY-MM-DD")
      ).unix();
      break;
    case "weekly":
      count = 167;
      periodType = "hours";
      // format = "YYYY-MM-DD HH";
      break;
    case "daily":
      count = 719;
      periodType = "hours";
      // format = "YYYY-MM-DD HH";
      break;
    case "monthly":
      count = 12;
      periodType = "months";
      // format = "YYYY-MM-DD HH";
      break;
    case "last_year":
      count = 364;
      periodType = "days";
      // format = "YYYY-MM-DD";
      break;
  }

  return {
    count,
    periodType,
    startDate
  };
};

const dataProviderKeys = {
  followers: ["followers", "subscribers"],
  posts: ["posts", "views", "likes", "comments"],
  stories: ["uploads", "views"]
};

const matchChartCode = code => {
  const r = code.match(/(.*)_detailed_histogram_(.*)/);
  if (!r) {
    return false;
  }
  if (!lineTypes[r[1]]) {
    return false;
  }
  const periodI = periodTypeNames.indexOf(r[2]);
  if (periodI === -1) {
    return false;
  }
  return {
    chartType: lineTypes[r[1]].chartType,
    chartName: lineTypes[r[1]].chartType + "Chart",
    lineType: r[1],
    lineTitle: lineTypes[r[1]].title,
    periodType: periodTypes[periodI].name,
    dataProviderKey: lineTypes[r[1]].dataProviderKey,
    subKey: lineTypes[r[1]].countSubKey,
    countPostfix: lineTypes[r[1]].countPostfix
  };
};

const matchCodeByPrefix = (code, prefix) => {
  return code.match(new RegExp(`${prefix}_(.*)`));
};

export {
  chartTypes,
  periodTypes,
  getPeriodType,
  lineTypes,
  chartDataSets,
  periodTypeNames,
  getScaleData,
  dataProviderKeys,
  matchChartCode,
  matchCodeByPrefix
};
