import request from "@/utils/request";
// import ChartDonutBuilding from "./chartDonutBuilding";

export default {
  // mixins: [ ChartDonutBuilding ],
  methods: {
    updateDonutData(data) {
      const statData =
        "NaN" === data.statistics.data ? 0 : data.statistics.data;

      switch (data.statistics.code) {
        // visitors
        case "view_profile_count_today":
          this.updateProfileDonut2(
            this.visitorsCountDonut,
            statData,
            "visitorsToday",
            "#FF335A"
          );
          break;
        case "view_profile_count_weekly":
          this.updateProfileDonut3(
            this.visitorsCountDonut,
            statData,
            "visitorsWeek",
            "#FF335A"
          );
          break;
        case "view_profile_count_all":
          this.updateProfileDonut3(
            this.visitorsCountDonut,
            statData,
            "visitorsTotal",
            "#FF335A",
            true
          );
          break;

        // users/guests
        case "view_profile_user_count_today":
          this.updateProfileDonut2(
            this.visitorsUsersCountDonut,
            statData,
            "visitorsUsers",
            "#ff9501"
          );
          break;
        case "view_profile_guest_count_weekly":
          this.updateProfileDonut3(
            this.visitorsUsersCountDonut,
            statData,
            "visitorsGuests",
            "#ff9501"
          );
          break;

        case "view_profile_by_device_count_today":
          this.updateProfileDeviceDonut(this.visitorsPlatformDonut, statData);
          break;

        case "view_profile_by_country_count_today":
          this.updateMap(statData);
          break;
      }
    },
    updateProfileDonut2(donut, statData, refKey, color) {
      if (!statData) {
        return;
      }
      if ("#7c8b96" === donut.dataProvider[0].color) {
        donut.dataProvider = [];
        donut.outlineThickness = "1.5";
        donut.alpha = 1;
      }
      donut.dataProvider[0] = {
        value: statData,
        color: color
      };
      donut.validateData();
      this.$refs[refKey].innerHTML = statData;
    },
    updateProfileDonut3(donut, statData, refKey, color, hasThird) {
      if (!statData) {
        return;
      }
      if ("#7c8b96" === donut.dataProvider[0].color) {
        donut.dataProvider = [];
        donut.outlineThickness = "1.5";
        donut.alpha = 1;
      }
      if ("undefined" === typeof donut.dataProvider[0]) {
        donut.dataProvider[0] = {
          value: 0,
          color: color
        };
      }
      if (hasThird) {
        if ("undefined" === typeof donut.dataProvider[1]) {
          donut.dataProvider[1] = {
            value: statData,
            color: "#3dbdd6"
          };
        }
        donut.dataProvider[2] = {
          value: statData,
          color: "#67cc2e"
        };
      } else {
        donut.dataProvider[1] = {
          value: statData,
          color: "#3bbdd3"
        };
      }
      donut.validateData();
      this.$refs[refKey].innerHTML = statData;
    },
    updateProfileDeviceDonut(donut, statData) {
      if ("undefined" !== typeof statData.mobile) {
        if ("#7c8b96" === donut.dataProvider[0].color) {
          donut.dataProvider = [];
          donut.outlineThickness = "1.5";
          donut.alpha = 1;
        }
        donut.dataProvider[0] = {
          value: statData.mobile,
          color: "#FF335A"
        };

        this.$refs.visitorsMobile.innerHTML = statData.mobile;
      }
      if ("undefined" !== typeof statData.desktop) {
        if ("#7c8b96" === donut.dataProvider[0].color) {
          donut.dataProvider = [];
          donut.outlineThickness = "1.5";
          donut.alpha = 1;
        }
        if ("undefined" === typeof donut.dataProvider[0]) {
          donut.dataProvider[0] = {
            value: 0,
            color: "#FF335A"
          };
        }
        donut.dataProvider[1] = {
          value: statData.desktop,
          color: "#67cc2e"
        };
        this.$refs.visitorsDesktop.innerHTML = statData.desktop;
      }
      donut.validateData();
    },
    async updateTopFollowers(statData) {
      let _ids = Object.keys(statData);
      if (!_ids.length) {
        return;
      }
      _ids = _ids.slice(0, 5);
      const ids = _ids.map(id => "ids[]=" + id);
      const response = await request(
        `users?access-token=` +
          this.$store.state.auth.token +
          "&" +
          ids.join("&"),
        {
          method: "GET"
        }
      );
      this.topFollowers = await response.json();
    }
  }
};
