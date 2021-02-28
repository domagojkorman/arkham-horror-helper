function randomIndex(items) {
  return Math.floor(Math.random() * items.length);
}

function randomItem(items) {
  return items[randomIndex(items)];
}

function shuffleItems(items) {
  const shuffledItems = [];
  let itemsCopy = [...items];
  for(let i = 0; i < items.length; i++) {
    const randomizedItem = randomItem(itemsCopy);
    itemsCopy = itemsCopy.filter((item) => item !== randomizedItem);
    shuffledItems.push(randomizedItem);
  }

  return shuffledItems;
}

function createDeck(cards) {
  const deck = [];
  cards.forEach((card) => {
    for (let i = 0; i < card.count; i++) {
      deck.push({...card, nr: i});
    }
  });

  return shuffleItems(deck);
}

export {
  randomItem,
  shuffleItems,
  createDeck
}
