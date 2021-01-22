function randomIndex(items) {
  return Math.floor(Math.random() * items.length);
}

function randomItem(items) {
  return items[randomIndex(items)];
}

function shuffleItems(items) {
  const shuffledItems = [];
  const itemsCopy = [...items];
  for(let i = 0; i < items.length; i++) {
    const randomItem = randomItem(itemsCopy);
    itemsCopy = itemsCopy.filter((item) => item !== randomItem);
    shuffledItems.push(randomItem);
  }

  return shuffledItems;
}

export {
  randomItem
}
