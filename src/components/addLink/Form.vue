<template>
  <div class="form">
    <form @submit.prevent="submitHandler">
      <div class="body">
        <div class="field url">
          <span class="label">Link url</span>
          <input
            type="text"
            placeholder="Link url..."
            v-model.trim="url"
            name="url"
          />
        </div>
        <div class="urlRoute">
          <span :class="{ selected: url && isWebLink }">Web URL</span>
          <span :class="{ selected: url && !isWebLink }">Snapchat</span>
          <span :class="{ selected: url && !isWebLink }">Oter</span>
        </div>
        <div class="field title">
          <span class="label">Link title</span>
          <input
            type="text"
            placeholder="Link title..."
            v-model.trim="title"
            name="title"
            required
          />
        </div>
        <div class="field pin">
          <label>
            <input type="checkbox" v-model="pinLink" />
            Pin link
          </label>
        </div>
      </div>
      <div class="footer">
        <button @click="closeHandler">Cancel</button>
        <button type="submit" :disabled="isDisabled">Add</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ["close"],
  data() {
    return {
      url: "",
      title: "",
      pinLink: false
    };
  },
  computed: {
    isDisabled() {
      return !this.url || !this.title;
    },
    isWebLink() {
      return this.isStringMatch(this.url);
    }
  },
  methods: {
    isStringMatch(str) {
      return str.indexOf("http") !== -1;
    },
    submitHandler(e) {
      const newLink = {
        url: this.url,
        title: this.title,
        pinLink: this.pinLink,
        id: Math.random() + Date.now()
      };
      this.closeHandler(e);
      this.$emit("submit", newLink);
    },
    clear() {
      this.url = "";
      this.title = "";
    },
    closeHandler(e) {
      this.clear();
      this.close(e);
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  padding: 1rem;
}
.body {
  padding: 1rem;
  .field {
    display: flex;
    align-items: center;
    padding: 10px 0;
    .label {
      margin-right: 1rem;
      white-space: nowrap;
    }
    input {
      flex-grow: 1;
    }
    &.pin {
      label {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        input {
          margin-right: 0.5rem;
        }
      }
    }
  }
  .urlRoute {
    padding: 10px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-evenly;
    span {
      color: rgba(124, 139, 150, 0.473);
      &.selected {
        color: #2196f3;
      }
    }
  }
}
.footer {
  padding: 1rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  button {
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    color: #2196f3;
    border: none;
    background-color: rgba(124, 139, 150, 0.1);
    border-radius: 3px;
    &:hover {
      background-color: rgba(124, 139, 150, 0.473);
    }
  }
}
</style>
