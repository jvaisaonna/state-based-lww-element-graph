import log from "fancy-log";

// Add union function to Set
Set.prototype.union = function (setB) {
  var union = new Set(this);
  for (var elem of setB) {
    union.add(elem);
  }
  return union;
};

const errorMessage = {
  ELEMENT_DOES_NOT_EXIST: "%s element does not exist or has been removed",
};

class SetElement {
  constructor(element, timestamp) {
    this.value = element;
    this.timestamp = timestamp;
  }
}

export default class LwwTwoPhaseSet {
  constructor() {
    this.addSet = new Set();
    this.removeSet = new Set();
  }

  list() {
    const resultSet = new Set();
    const lookupCache = {};

    for (const element of this.addSet) {
      const { value } = element;
      if (lookupCache[value]) continue;

      const lookupResult = this.lookup(value);
      lookupCache[value] = lookupResult;

      if (lookupResult) {
        resultSet.add(element.value);
      }
    }

    return resultSet;
  }

  lookup(element) {
    const addSet = [...this.addSet];
    const removeSet = [...this.removeSet];
    let elementInAddSet = null;
    let elementInRemoveSet = null;

    // Find the element with higher timestamp in add set
    for (let i = addSet.length - 1; i >= 0; i -= 1) {
      if (element === addSet[i].value) {
        elementInAddSet = addSet[i];
        break;
      }
    }

    // Find the element with higher timestamp in remove set
    for (let i = removeSet.length - 1; i >= 0; i -= 1) {
      if (element === removeSet[i].value) {
        elementInRemoveSet = removeSet[i];
        break;
      }
    }

    return (
      (elementInAddSet && !elementInRemoveSet) ||
      (elementInAddSet &&
        elementInRemoveSet &&
        elementInAddSet.timestamp > elementInRemoveSet.timestamp)
    );
  }

  add(element, timestamp = Date.now()) {
    this.addSet.add(new SetElement(element, timestamp));
  }

  remove(element, timestamp = Date.now()) {
    if (!this.lookup(element)) {
      log(errorMessage.ELEMENT_DOES_NOT_EXIST, element);
      return;
    }
    this.removeSet.add(new SetElement(element, timestamp));
  }

  merge(incomingTwoPhaseSet) {
    this.addSet = this.addSet.union(incomingTwoPhaseSet.addSet);
    this.removeSet = this.removeSet.union(incomingTwoPhaseSet.removeSet);
  }
}