<template>
  <div class="table-wrapper">
    <div class="table">
      <div class="item" v-for="v in items" :key="v.id">
        <div class="table__cell">
          <a class="userview-block">
            <span class="avatar avatar_sm">
              <span class="avatar__img">
                <img :src="v.avatar" v-if="v.avatar" />
              </span>
            </span>
            <div class="name">{{ v.name }}</div>
            <span class="user-login reset-ml">{{ v.username }}</span>
          </a>
        </div>
        <div class="table__cell">
          <button type="button" class="delete" @click="remove(v)"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    }
  },
  methods: {
    remove(user) {
      this.$emit("remove", user);
    }
  }
};
</script>
