import Component from '@glimmer/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import {shuffleItems} from 'arkham-horror-helper/utils/shuffle';

export default class ReorderDeckComponent extends Component {

  @tracked cards = this.args.cards

  @action onCardClick(card) {
    if (Number.isInteger(card.order)) {
      const order = card.order;
      this.args.cards.forEach((card) => {
        if (card.order > order) {
          card.order = card.order - 1;
        }
      });
      card.order = 'S';
    } else if (card.order === 'S') {
      card.order = null;
    } else {
      const currentOrderNr = this.args.cards.reduce((number, card) => {
        if (card.order === 'S') {
          return number;
        }

        return Math.max(card.order || 0, number);
      }, 0);
      card.order = currentOrderNr + 1;
    }

    this.cards = [...this.cards];
  }

  @action onConfirmClick() {
    const parts = this.cards.reduce((lists, card) => {
      if (Number.isInteger(card.order)) {
        lists.ordered.push(card);
      } else if (card.order === 'S') {
        lists.fixed.push(card);
      } else {
        lists.rest.push(card);
      }

      return lists;
    }, {
      ordered: [],
      fixed: [],
      rest: [],
    });
    parts.ordered = parts.ordered.sort((a, b) => a.order - b.order);
    parts.fixed = shuffleItems(parts.fixed);
    parts.rest = shuffleItems(parts.rest);
    const deck = [...parts.ordered, ...parts.fixed, ...parts.rest];
    deck.forEach((card) => {
      delete card.order;
    })
    this.args.onChange(deck);
  }

  @action onDiscardClick() {
    this.cards.forEach((card) => {
      delete card.order;
    })
    this.args.onChange(this.cards);
  }
}
