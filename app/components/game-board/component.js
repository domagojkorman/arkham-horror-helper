import Component from '@glimmer/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import cards from 'arkham-horror-helper/models/cards';
import CardModel from 'arkham-horror-helper/models/card';
import {randomItem} from 'arkham-horror-helper/utils/shuffle';

const Mode = {
  IN_GAME: 'game',
  EDIT_TOKENS: 'tokens',
  EDIT_DECK: 'deck',
  EDIT_PLAY_AREA: 'play',
}
export default class GameBoardComponent extends Component {

  @tracked tokens = []
  @tracked drawnTokens = []
  @tracked tokenDrawCount = 0
  @tracked cards = []
  @tracked deck = []
  @tracked playDeck = []
  @tracked discardDeck = []
  @tracked mode = Mode.IN_GAME

  get isEditMode() {
    return this.mode !== Mode.IN_GAME
  }


  // TOKENS
  get tokenBag() {
    return this.tokens.filter((token) => !this.drawnTokens.includes(token));
  }

  get isEditTokensMode() {
    return this.mode === Mode.EDIT_TOKENS;
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

  @action setMode(mode) {
    this.mode = mode;
  }

  @action onEditTokensClick() {
    this.mode = Mode.EDIT_TOKENS;
  }

  @action onTokensChange(tokens) {
    this.tokens = tokens;
    this.mode = Mode.IN_GAME;
  }
}
