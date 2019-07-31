"use strict";

export default {
  indexBy(items, conditionAction) {
    return items.findIndex(item => conditionAction(item));
  },
  itemBy(items, conditionAction) {
    let filtered = this.itemsBy(items, item => conditionAction(item));
    if (filtered.length == 0) return null;
    return filtered[0];
  },
  itemsBy(items, conditionAction) {
    return items.filter(item => conditionAction(item));
  },
  modifyByCondition(items, conditionAction, modifyAction, vue) {
    items = items.map((item, index) => {
      if (conditionAction(item, index)) {
        modifyAction(item, index);
        vue.$set(items, index, item);
      }
      return item;
    });
    return items;
  },
  // updateAction have to return updated item
  updateByCondition(items, conditionAction, updateAction, vue) {
    items = items.map((item, index) => {
      if (conditionAction(item, index)) {
        item = updateAction(item, index);
        vue.$set(items, index, item);
      }
      return item;
    });
    return items;
  },
  updateByIndex(items, indexToUpdate, updateAction, vue) {
    items = this.updateByCondition(
      items,
      (item, index) => index == indexToUpdate,
      updateAction,
      vue
    );
    return items;
  }
};
