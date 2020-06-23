<template>
  <tbody>
    <tr>
      <td>{{ data.name }}</td>
      <td>{{ data.modelData.rank }}</td>
      <td>{{ data.starts_at }} - {{ data.ends_at }}</td>
      <td class="toggler">
        <label class="toggle-element">
          <input type="checkbox" id="subscribedOffline" v-model="opened" />
          <span class="toggle-element_switcher"></span>
        </label>
      </td>
    </tr>
    <tr v-if="opened">
      <td colspan="4">
        <div class="edit">
          <form @submit.prevent="update">
            <div
              class="form-group-inner form-group_with-label"
              :class="{ 'success icn-item': imageSelected }"
            >
              <span class="label">Upload Image</span>
              <div class="photo-label-wrapper">
                <label
                  for="personalIdImage"
                  class="btn btn_fix-width btn_block border photo-btn"
                  >Choose</label
                >
              </div>
              <input
                type="file"
                id="personalIdImage"
                accept=".jpg,.jpeg,.png"
                ref="image"
                name="image"
                @change="handleImageChoose"
              />
            </div>
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Description</span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field">
                    <textarea
                      rows="3"
                      name="description"
                      maxlength="500"
                      style="resize: none; overflow: hidden; height: 50px;"
                      v-model="currentData.description"
                    >
                    </textarea>
                  </span>
                </span>
              </label>
            </div>

            <div class="form-group-btn">
              <button
                type="submit"
                class="btn lg btn_fix-width-sm"
                :disabled="!valid"
              >
                Save
              </button>
            </div>
          </form>

          <!--
          <div class="form-group form-group_with-label promote">
            <div class="form-group-inner form-group-title">
              <span class="label">Promote Contest</span>
              <div class="input">http://asd</div>
              <button
                type="button"
                class="btn border disconnect-twitter semi-transparent"
              >
                Copy
              </button>
            </div>
          </div>
          -->

          <div class="supporters" v-if="data.topSupporters.length">
            <div>
              <table>
                <tr>
                  <th>Top Supporters</th>
                  <th>Amount</th>
                </tr>
                <tr v-for="v in data.topSupporters" :key="v.username">
                  <td>{{ v.name }}</td>
                  <td>${{ v.amount }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      opened: false,
      currentData: {},
      formData: null,
      imageSelected: false
    };
  },
  computed: {
    valid() {
      return this.currentData.description && this.imageSelected;
    }
  },
  methods: {
    handleImageChoose(event) {
      console.log(event);
      const files = event.target.files;
      if (!files.length) {
        this.formData.delete("image");
        this.imageSelected = false;
        return;
      }
      this.formData.append("image", files[0]);
      this.imageSelected = true;
    },
    update() {
      this.formData.append("description", this.currentData.description);
      this.$store.dispatch("contest/update", {
        contestId: this.data.id,
        body: this.formData
      });
    }
  },
  mounted() {
    this.currentData = this.data;
    this.formData = new FormData();
  }
};
</script>
