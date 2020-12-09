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
  // moment - используется для формирования периода графика, который отображается в заголовке
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
    name: "monthly",
    title: "Monthly",
    moment: "month"
  },
  {
    name: "all",
    title: "Yearly",
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

const getScaleData = periodType => {
  if (!getPeriodType(periodType)) {
    throw new Error(`periodType ${periodType} does not exists`);
  }

  const now = moment()
    .utc()
    .unix();

  let units;
  let count; // количество единиц типа units назад от текущего времени
  let startDate = now;
  let barCount = 80;
  let scaleCount = null;
  let unitsInBar = 1; // количество единиц типа units в одном делении линейки
  /// let barCount = 5;
  let startFromFirstDayOfWeek = false;
  let displayFormat = "YYYY-MM-DD";

  switch (periodType) {
    case "today":
      count = 1439;
      units = "minutes";
      startDate = moment(
        moment
          .unix(now)
          .add(1, "d")
          .format("YYYY-MM-DD")
      ).unix();
      break;
    case "daily":
      count = 30;
      units = "days";
      barCount = 30;
      scaleCount = 15;
      unitsInBar = 2;
      displayFormat = "D";
      break;
    case "weekly":
      count = 7;
      units = "days";
      barCount = 7;
      startFromFirstDayOfWeek = true;
      displayFormat = "ddd";
      break;
    case "monthly":
      count = 12;
      units = "months";
      barCount = 12;
      unitsInBar = 1;
      displayFormat = "MMM";
      break;
    // case "yearly":
    case "all":
      count = 5;
      units = "years";
      barCount = 5;
      unitsInBar = 1;
      displayFormat = "YYYY";
      break;
  }

  if (scaleCount === null) {
    scaleCount = barCount;
  }

  return {
    count,
    units,
    startDate,
    barCount,
    scaleCount,
    unitsInBar,
    displayFormat,
    startFromFirstDayOfWeek
  };
};

const dataProviderKeys = {
  followers: ["followers", "subscribers"],
  posts: ["posts", "views", "likes", "comments"],
  stories: ["uploads", "views"],
  earnings: [
    "paid_subscriptions",
    "tips",
    "paid_chat_messages",
    "earn_referral"
  ]
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
