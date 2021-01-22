import Component from '@glimmer/component';
import tokens from 'arkham-horror-helper/models/tokens';
import {action} from '@ember/object';
import {A as emberArray} from '@ember/array';
import {tracked} from '@glimmer/tracking';

export default class EditTokenBagComponent extends Component {

  @tracked tokenBag = this.args.tokens || [];

  get tokens() {
    return tokens.sort((a, b) => a.order - b.order);
  }

  @action onAddTokenClick(token) {
    this.tokenBag = this.tokenBag.concat({...token, id: Date.now().toString()});
    this.tokenBag.sort((a, b) => a.order - b.order);
  }

  @action onRemoveTokenClick(token) {
    this.tokenBag = this.tokenBag.filter((bagToken) => bagToken !== token);
  }
}
