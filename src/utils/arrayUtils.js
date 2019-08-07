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
    items.map((item, index) => {
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
    items.map((item, index) => {
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
  },
  mergeByCondition(items1, items2, condition, vue) {
    let newItems = [];
    items2.forEach(item2 => {
      var index1 = items1.findIndex(item1 => {
        return condition(item1, item2);
      });
      if (index1 >= 0) {
        vue.$set(items1, index1, item2);
      } else {
        newItems.push(item2);
      }
    });

    return [...items1, ...newItems];
  }
};
