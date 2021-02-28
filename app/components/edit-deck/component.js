import Component from '@glimmer/component';
import allCards from 'arkham-horror-helper/models/cards';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';

const ALL_SETS = allCards.reduce((sets, card) => {
  if (!card.encounter || ['location', 'agenda', 'act', 'scenario'].includes(card.type)) {
    return sets;
  }

  let set = sets.find((s) => s.name === card.encounter);
  if (set) {
    set.cards.push(card);
  } else {
    set = {name: card.encounter, cards: [card]};
    sets.push(set);
  }

  return sets;
}, []);

export default class EditDeckComponent extends Component {

  @tracked cards = this.args.cards || [];
  @tracked search = '';

  get filteredSets() {
    return ALL_SETS.filter((set) => set.name.toLowerCase().includes(this.search) || set.cards.some((card) => card.name.toLowerCase().includes(this.search)));
  }

  @action onSetRemoveClick(set) {
    set.cards.forEach((card) => {
      this.cards = this.cards.filter((c) => c.id !== card.id);
    });
  }

  @action onSetAddClick(set) {
    set.cards.forEach((card) => {
      const deckCard = this.cards.find((c) => c.id === card.id);
      if (deckCard) {
        deckCard.count = card.quantity;
      } else {
        this.cards = [...this.cards, {...card, count: card.quantity}]
      }
    });
  }

  @action onCardAddClick(card) {
    const deckCard = this.cards.find((c) => c.id === card.id);
    if (deckCard) {
      deckCard.count = card.quantity;
    } else {
      this.cards = [...this.cards, {...card, count: card.quantity}];
    }
  }

  @action onCardRemoveClick(card) {
    const deckCard = this.cards.find((c) => c.id === card.id);
    if (deckCard) {
      this.cards = this.cards.filter((c) => c.id !== deckCard.id);
    }
  }

  @action onSearchChange(event) {
    this.search = event.target.value;
  }

  @action onCardIncrementClick(card) {
    card.count = Math.min(card.count + 1, card.quantity);
    this.cards = [...this.cards];
  }

  @action onCardDecrementClick(card) {
    card.count = card.count - 1;
    if (!card.count) {
      this.cards = this.cards.filter((c) => c.id !== card.id);
    }
    this.cards = [...this.cards];
  }
}
