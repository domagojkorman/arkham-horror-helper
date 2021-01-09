import Model from '@ember-data/model';
import {tracked} from '@glimmer/tracking';

export default class CardModel extends Model {

  id
  name
  pack
  type
  encounter
  health
  healthPerInvestigator
  frontImg
  backImg
  quantity
  @tracked amount

  constructor(card) {
    super(...arguments);
    const {
      id,
      name,
      pack,
      type,
      encounter,
      health,
      healthPerInvestigator,
      frontImg,
      backImg,
      quantity,
    } = card;

    this.id = id;
    this.name = name;
    this.pack = pack;
    this.type = type;
    this.encounter = encounter;
    this.health = health;
    this.healthPerInvestigator = healthPerInvestigator;
    this.frontImg = frontImg;
    this.backImg = backImg;
    this.quantity = quantity;
    this.amount = quantity;
  }
}
