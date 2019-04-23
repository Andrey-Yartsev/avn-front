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
        <div
          class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_selected"
        >
          <time datetime="">20 Mar</time>
        </div>
        <div
          class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_status"
        >
          <button type="button" class="btn-unblock"></button>
        </div>
        <div
          class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_remove"
        >
          <button type="button" class="btn_delete" @click="remove(v)"></button>
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
