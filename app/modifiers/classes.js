import {modifier} from 'ember-modifier';

function classes(element, params, hash) {
  const filteredClasses = Object.keys(hash).filter((key) => Boolean(hash[key]));
  element.classList.add(...filteredClasses);
}

export default modifier(classes);
