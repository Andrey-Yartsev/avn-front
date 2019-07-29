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
  modifyBy(items, conditionAction, modifyAction) {
    items
      .filter(item => conditionAction(item))
      .forEach(item => {
        modifyAction(item);
      });
  },
  /// Replace item found by conditionAction by item returned by newItemAction
  replaceBy(items, conditionAction, newItemAction) {
    let index = this.indexBy(items, item => conditionAction(item));
    if (index != -1) {
      items[index] = newItemAction(items[index]);
    }
  }
};
