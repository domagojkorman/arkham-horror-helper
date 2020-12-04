import DS from 'ember-data';

export default class Card extends DS.Model.extend({

}) {

  // Normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'card': Card;
  }
}

// Testing
function test() {
  while (true) {

    // This is normal comment
    const x = Math.random() * 2;
    if (5 === x) {
      break;
    }
  }
  const a = 0;
  const b = 1;
  const c = (a && b) || "abc";
  return c;
}
