import Controller from '@ember/controller';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import cards from 'arkham-horror-helper/models/cards';
import {A as emberArray } from '@ember/array';

const Phase = {
  ENCOUNTER: 'encounter',
  TOKENS: 'tokens',
  IN_GAME: 'game',
}
export default class IndexController extends Controller {

  @tracked phase = Phase.ENCOUNTER
  @tracked search = ''
  @tracked encounterDeck = emberArray();

  get title() {
    switch (this.phase) {
    case Phase.ENCOUNTER: return 'Assemble encounter deck';
    case Phase.TOKENS: return 'Assemble tokens bag';
    default: return ''
    }
  }

  get encounterCardSets() {
    return this.encounterDeck.reduce((sets, card) => {
      const existingSet = sets.find((set) => set.name === card.encounter);
      const set = existingSet || {name: card.encounter, cards: []};
      if (!existingSet) {
        sets.push(set);
      }
      set.cards.push(card);
      return sets;
    }, []);
  }

  get cardSets() {
    return cards.filter((card) => !['scenario', 'location', 'act', 'agenda'].includes(card.type))
      .filter((card) => Boolean(card.encounter))
      .map((card) => {
        const deckCard = this.encounterDeck.find((encounter) => card.id === encounter.id);
        return {...card, isInDeck: Boolean(deckCard)};
      })
      .reduce((sets, card) => {
        const existingSet = sets.find((set) => set.name === card.encounter);
        const set = existingSet || {name: card.encounter, cards: []};
        if (!existingSet) {
          sets.push(set);
        }
        set.cards.push(card);
        return sets;
      }, [])
      .map((set) => {
        const isInDeck = set.cards.every((card) => {
          const deckCard = this.encounterDeck.find((encounter) => card.id === encounter.id);
          return Boolean(deckCard);
        });
        return {...set, isInDeck};
      })
      .filter((set) => {
        const searchInSetName = set.name.toLowerCase().includes(this.search);
        const searchInSetCardName = set.cards.any((card) => card.name.toLowerCase().includes(this.search));
        return searchInSetName || searchInSetCardName;
      });
  }

  get isEncounterDeckPhase() {
    return this.phase === Phase.ENCOUNTER;
  }

  get isTokensBagPhase() {
    return this.phase === Phase.TOKENS;
  }

  get isGamePhase() {
    return this.phase === Phase.IN_GAME;
  }

  @action onSearchChange(event) {
    this.search = event.target.value;
  }

  @action onAddSetClick(set) {
    this.search = '';
    set.cards.filter((card) => {
      const deckCard = this.encounterDeck.find((encounter) => encounter.id === card.id);
      return !deckCard;
    })
      .forEach((card) => this.encounterDeck.pushObject({...card, amount: card.quantity}))
  }

  @action onAddCardClick(card) {
    if (!card.isInDeck) {
      this.encounterDeck.pushObject({...card, amount: card.quantity});
    }
  }

  @action onBackClick() {
    switch (this.phase) {
    case Phase.TOKENS:
      this.phase = Phase.ENCOUNTER;
      break;
    default: //do nothing
    }
  }

  @action onNextClick() {
    switch (this.phase) {
    case Phase.TOKENS:
      this.phase = Phase.IN_GAME;
      break;
    case Phase.ENCOUNTER:
      this.phase = Phase.TOKENS;
      break;
    default: //do nothing
    }
  }
}
