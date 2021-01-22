import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';
import {randomItem} from 'arkham-horror-helper/utils/shuffle';

export default class TokenBagAreaComponent extends Component {

  @tracked drawPile = []

  get bagPile() {
    return this.args.tokens.filter((token) => !this.drawPile.includes(token))
  }

  get canDraw() {
    return this.args.tokens.length !== 0;
  }

  get canDrawNext() {
    return this.bagPile.length !== 0;
  }

  @action onDrawNewClick() {
    this.drawPile = [];
    const token = randomItem(this.bagPile);
    this.drawPile = [token];
  }

  @action onOneMoreClick() {
    const token = randomItem(this.bagPile);
    this.drawPile = this.drawPile.concat(token);
  }

  @action onEditClick() {
    this.args.editTokenBag();
    this.drawPile = [];
  }

  @action onTokenClick(token) {
    this.drawPile = this.drawPile.filter((t) => t !== token);
  }
}
