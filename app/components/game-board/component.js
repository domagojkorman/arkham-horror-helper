import Component from '@glimmer/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import cards from 'arkham-horror-helper/models/cards';
import CardModel from 'arkham-horror-helper/models/card';
import {randomItem, shuffleItems, createDeck} from 'arkham-horror-helper/utils/shuffle';

const Mode = {
  IN_GAME: 'game',
  EDIT_TOKENS: 'tokens',
  EDIT_DECK: 'deck',
  REORDER_DECK: 'reorder',
}
export default class GameBoardComponent extends Component {

  @tracked tokens = []
  @tracked drawnTokens = []
  @tracked tokenDrawCount = 0
  @tracked cards = []
  @tracked deck = []
  @tracked playDeck = []
  @tracked discardDeck = []
  @tracked card;
  @tracked mode = Mode.IN_GAME
  @tracked showPlayArea = false;

  @action setMode(mode) {
    this.mode = mode;
  }

  @action onInit(event) {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.mode = Mode.IN_GAME;
        this.showPlayArea = false;
      }
    })
  }

  // TOKENS

  get tokenBag() {
    return this.tokens.filter((token) => !this.drawnTokens.includes(token));
  }

  get canDrawToken() {
    return this.tokens.length;
  }

  get canDrawNextToken() {
    return this.tokenBag.length;
  }

  @action onDrawTokenClick() {
    this.drawnTokens = [];
    this.onDrawNextTokenClick();
  }

  @action onDrawNextTokenClick() {
    const token = randomItem(this.tokenBag);
    this.tokenDrawCount = this.tokenDrawCount + 1;
    token.drawCount = this.tokenDrawCount;
    this.drawnTokens = [...this.drawnTokens, token];
  }

  @action onTokenClick(token) {
    this.drawnTokens = this.drawnTokens.filter((t) => t !== token);
  }

  @action onTokensChange(tokens) {
    this.tokens = tokens;
    this.mode = Mode.IN_GAME;
  }

  // Deck

  get canDrawCard() {
    return this.deck.length && !this.card;
  }

  @action onDrawCardClick() {
    if (this.deck.length) {
      this.card = this.deck[0];
      this.deck = this.deck.slice(1);
    } else {
      this.onShuffleDeckClick();
      this.onDrawCardClick();
    }

  }

  @action onShuffleDeckClick() {
    this.deck = shuffleItems(this.deck);
  }

  @action onDeckChange(cards) {
    this.cards = cards;
    this.deck = createDeck(cards);
    this.deck = this.deck.filter((card) => {
      const inPlay = this.playDeck.find((playCard) => playCard.id === card.id && playCard.nr === card.nr);
      const inDiscard = this.discardDeck.find((discardCard) => discardCard.id === card.id && discardCard.nr === card.nr);
      return !inPlay && !inDiscard;
    });
    this.mode = Mode.IN_GAME;
  }

  @action onToDeckCardClick(deck, card) {
    this.deck = [...this.deck, card];
    if (deck === 'play') {
      this.playDeck = this.playDeck.filter((playCard) => playCard.id !== card.id || playCard.nr !== card.nr);
    } else if (deck === 'discard') {
      this.discardDeck = this.discardDeck.filter((discardCard) => discardCard.id !== card.id || discardCard.nr !== card.nr);
    }
  }

  @action onToPlayCardClick(deck, card) {
    this.playDeck = [...this.playDeck, card];
    if (deck === 'current') {
      this.card = null;
    } else if (deck === 'discard') {
      this.discardDeck = this.discardDeck.filter((discardCard) => discardCard.id !== card.id || discardCard.nr !== card.nr);
    }
  }

  @action onToDiscardCardClick(deck, card) {
    this.discardDeck = [...this.discardDeck, card];
    if (deck === 'current') {
      this.card = null;
    } else if (deck === 'play') {
      this.playDeck = this.playDeck.filter((playCard) => playCard.id !== card.id || playCard.nr !== card.nr);
    }
  }

  @action onRemoveCardClick(deck, card) {
    if (deck === 'current') {
      this.card = null;
    } else if (deck === 'play') {
      this.playDeck = this.playDeck.filter((playCard) => playCard.id !== card.id || playCard.nr !== card.nr);
    } else if (deck === 'discard') {
      this.discardDeck = this.discardDeck.filter((discardCard) => discardCard.id !== card.id || discardCard.nr !== card.nr);
    }
  }

  // Play area

  @action togglePlayArea(value) {
    this.showPlayArea = value;
  }

  get canTogglePlayArea() {
    return this.playDeck.length || this.discardDeck.length;
  }

  @action onDiscardIntoDeckClick() {
    this.deck = [...this.deck, ...this.discardDeck];
    this.discardDeck = [];
  }

  @action onOrderChange(deck) {
    this.deck = deck;
    this.mode = Mode.IN_GAME;
  }
}
