'use strict';

import description from './descriptor.js';

import LiteLoader from './LiteLoader.js';
import Creature from './dna/Creature.js';
import Gene from './dna/Gene.js';
import GeneBank from './dna/GeneBank.js';
import TagsBank from './dna/TagsBank.js';
import GeneInterpolationBank from './dna/GeneInterpolationBank.js';
import Mutator from './dna/Mutator.js';
import GeneSet from './dna/GeneSet.js';

let output = window.document.querySelector('.output');
let editor = window.document.querySelector('.editor');

let data = undefined;

editor.addEventListener('input', event => {
  console.dir(editor.textContent);
  output.textContent = description.parseDescriptionsFile(editor.textContent, data);
});

var loaderCompleteHandler = function ()
{
  //MUTANT
  var tagsBank = new TagsBank(loader.content.tags);
  var geneBank = new GeneBank(tagsBank, loader.content.genes);
  var geneInterpolationBank = new GeneInterpolationBank(geneBank, loader.content.interpolations);
  var mirmignon = new Creature(new GeneSet(tagsBank, geneBank));
  mirmignon.createFromObject(loader.content.creatures.Cassie, geneBank);

  var mutator = Object.create(Mutator);
  mutator.init(geneBank, geneInterpolationBank, tagsBank);
  mutator.setPower(99999);
  //mutator.mutateRandom(mirmignon.geneSet);
  data = mirmignon.geneSet.getModifiers();
  console.log(mirmignon.geneSet.getModifiers());

  let desc = loader.content.descriptions;
  editor.textContent = desc;

  output.textContent = description.parseDescriptionsFile(desc, data);

  // $('#js-mutation').on('click', function ()
  // {
  //   mutator.mutateRandom(mirmignon.geneSet);
  //   console.log(mirmignon.geneSet.getModifiers());
  // });
};

var loaderErrorHandler = function ()
{
  console.log('error');
};

var loader = LiteLoader.create();
loader.getJSON('tags', 'src/data/other/tags.json');
loader.getJSON('genes', 'src/data/other/genes.json');
loader.getJSON('interpolations', 'src/data/other/interpolations.json');
loader.getJSON('creatures', 'src/data/other/creatures.json');
loader.get('descriptions', 'src/data/other/main.desc');

loader.allComplete().then(loaderCompleteHandler);

// var loader = new LiteLoader(loaderCompleteHandler, loaderErrorHandler);
// loader.appendJSONLoader({ name: 'tags', URL: 'src/data/tags.json' });
// loader.appendJSONLoader({ name: 'genes', URL: 'src/data/genes.json' });
// loader.appendJSONLoader({ name: 'interpolations', URL: 'src/data/interpolations.json' });
// loader.appendJSONLoader({ name: 'creatures', URL: 'src/data/creatures.json' });
// loader.appendStringLoader({ name: 'descriptions', URL: 'src/data/main.desc' });
// loader.load();
