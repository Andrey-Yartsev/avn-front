<template>
  <div class="payouts-personal-info">
    <div
      class="form-group form-group_clear-gaps-bottom form-group_with-label item"
    >
      <span class="title">Name</span>
      <span class="value">
        <span class="value__text">
          {{ info.firstName }} {{ info.lastName }}
        </span>
      </span>
    </div>
    <div
      class="form-group form-group_clear-gaps-bottom form-group_with-label item"
    >
      <span class="title">Address</span>
      <span class="value value_editable-field">
        <span class="value__text">
          {{ address }}
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: Object
  },
  computed: {
    address() {
      return (
        this.info.address +
        ", " +
        // this.info.city +
        // ", " +
        this.info.zip +
        (this.info.state ? ", " + this.info.state.name : "") +
        ", " +
        this.info.country.name
      );
    }
  }
};
</script>
