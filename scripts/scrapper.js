/* eslint-disable max-params */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const https = require('https');

function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}

function request(url, type = 'json') {
  return new Promise((resolve, reject) => {
    https.request(url, (response) => {
      let result = '';
      if (type !== 'json') {
        response.setEncoding('base64');
      }
      response.on('data', (chunk) => {
        result += chunk;
      });

      response.on('end', () => {
        try {
          if (type === 'json') {
            resolve(JSON.parse(result));
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      });

      response.on('error', (error) => {
        reject(error);
      });
    }).end();
  });
}

function noop() {

  // do nothing
}

function fetchSets() {
  return request('https://arkhamdb.com/api/public/cards/')
    .then((response) => {
      const sets = new Set();
      response.forEach(card => sets.add(card.pack_code));
      return [...sets];
    })
    .catch(noop)
}

function fetchSetCards(set) {
  return request(`https://arkhamdb.com/api/public/cards/${set}`).catch(noop);
}

function createDir(set) {
  const dasherizedName = set.toLowerCase().replace(/\s/gi, '-')
  const dir = `./public/assets/images/${dasherizedName}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir;
}

async function downloadAndSaveImage(dir, url, code, isBack = false) {
  if (!url) {
    return null;
  }

  const fullPath = `${dir}/${code}${isBack ? 'b' : ''}.png`;
  if (!fs.existsSync(fullPath)) {
    await sleep();
    const image = await request(`https://arkhamdb.com${url}`, 'image');
    fs.writeFileSync(fullPath, image, { encoding: 'base64' });
  }

  return fullPath.split('/').slice(2).join('/');
}

async function scrape() {
  const cards = [];
  const sets = await fetchSets();

  for (let setNr = 0; setNr < sets.length; setNr++) {
    const set = sets[setNr];
    const setCards = await fetchSetCards(set);
    const dir = createDir(setCards[0].pack_name);
    console.log(`Set ${setNr + 1}/${sets.length}: [${setCards[0].pack_name}]`);

    for (let cardNr = 0; cardNr < setCards.length; cardNr++) {
      const card = setCards[cardNr];
      console.log(`Card ${cardNr + 1}/${setCards.length}: [${card.name}]`);

      const frontImg = await downloadAndSaveImage(dir, card.imagesrc, card.code, false);
      const backImg = await downloadAndSaveImage(dir, card.backimagesrc, card.code, true);
      cards.push({
        id: card.code,
        pack: card.pack_name,
        type: card.type_code,
        encounter: card.encounter_name || null,
        name: card.name,
        health: card.health,
        healthPerInvestigator: card.health_per_investigator,
        quantity: card.quantity,
        frontImg,
        backImg,
      });
    }
  }

  fs.writeFileSync(`public/assets/cards.json`, JSON.stringify(cards));
}

scrape();
