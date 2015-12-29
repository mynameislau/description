let descriptor = {

  parseDescriptionsFile: function (file, data) {
    let parsedContent = descriptor.parseContent(file);
    for (let name in parsedContent) {
      parsedContent[name] = descriptor.parseContent(parsedContent[name]);
    }

    //var condition = "(toto = 'blue' & 'green' = 'green') & 'red' = 'redd' | 'tutu' = 'tutu'";
    //var condition = 'toto';

    return descriptor.getDescription('body', parsedContent, data);
    //console.log('result', descriptor.getDescription('body', parsedContent, data));
  },

  parseContent: function (value) {
    // let regex = /( *)(.+):\n((?:\1  .*[\s]?)*)/gm;
    //let regex = /( *)(.+):\n((?:\1\s.*[\s]?)*)/gm;

    // celle la fonctionne dans regexr : /^( *)(.+):$\n((?:(?:^\1 .*\n?)|^$\n?)*)/gm
    let regex = /(^ *)(.*):$\s((?:(?:^\1 .*$\s?)|(?:^$\s))*)/gm;
    let result;
    let parsed = {};

    do {
      result = regex.exec(value);
      console.log(result);
      if (!result) { break; }
      let content = result[3];
      content = content.replace(/^  /gm, '');
      content = content.replace(/\n$/, '');
      parsed[result[2]] = content;
    }
    while (result);
    // for(let name in parsed) {
    //   console.log(name);
    // }

    return parsed;
  },

  parseExpression: function (expression, data) {
    //console.log('parsing expression', expression);
    if (expression.startsWith('\'')) { return expression.replace(/'/g, ''); }
    else { return data[expression]; }
  },

  evaluate: function (condition, data) {
    //console.log('evaluate', condition);

    let comparison = /(\S*)?([=<>])(\S*)?/;
    let comparisonResult = comparison.exec(condition);
    //console.log(comparisonResult);

    if (comparisonResult) {
      let expressionA = descriptor.parseExpression(comparisonResult[1], data);
      let operand = comparisonResult[2];
      let expressionB = descriptor.parseExpression(comparisonResult[3], data);

      //console.log(condition, expressionA, operand, expressionB);

      switch (operand) {
        case '>':
          return expressionA > expressionB;

        case '<':
          return expressionA < expressionB;

        case '=':
          return expressionA === expressionB;

        default:
          throw new Error('invalid evaluation');
      }
    }
    else {
      if (condition === '*') { return true; }
      else { return descriptor.parseExpression(condition, data) !== undefined && descriptor.parseExpression(condition, data) !== false; }
    }
  },

  stripFirstLevelParentheses: function (condition, data) {
    let depth = 0;
    let openedOnce = false;
    let stripped = '';

    var stringArray = Array.from(condition);
    for (var i = 0, length = stringArray.length; i < length; i += 1)
    {
      var item = stringArray[i];

      if (depth === 0 && ((item !== '(' && item !== ')') || openedOnce)) {
        return condition;
      }
      else
      {
        if (item === '(') {
          openedOnce = true;
          depth += 1;
        }
        else if (item === ')')
        {
          depth -= 1;
        }
        else {
          stripped += item;
        }
      }
    }

    return stripped;
  },

  parseCondition: function (condition, data) {
    //console.log('parsing condition', condition);
    let noSpace = condition.replace(/\s/g, '');
    return descriptor.performComparisons(noSpace, data);
  },

  performComparisons: function (condition, data) {
    //console.log('performComparisons', condition);

    condition = descriptor.stripFirstLevelParentheses(condition);

    let testCondition = /[\(\)&\|]/gm;
    if (!testCondition.test(condition)) { return descriptor.evaluate(condition, data); }

    let depth = 0;
    let operand;
    let index = 0;
    let result;

    let opened = false;
    let beforeOperand = '';
    let afterOperand = '';
    let hasParenthesis = false;
    let group = '';

    let groups = [''];
    let operands = [];

    Array.from(condition).forEach(item => {
      if (item === ')') {
        depth -= 1;
        if (depth === 0) {
          opened = false;
        }
      }
      if (item === '(') {
        if (depth === 0) { opened = true; }
        depth += 1;
      }

      if (depth === 0 && (item === '&' || item === '|')) {
        groups.push('');
        operands.push(item);
      }
      else
      {
        groups[groups.length - 1] += item;
      }
    });

    var results = groups.map(item => descriptor.parseCondition(item, data));

    while (results.length > 1) {
      if (operands[0] === '&') {
        results[1] = results[0] && results[1];
      }
      if (operands[0] === '|') {
        results[1] = results[0] || results[1];
      }
      results.shift();
      operands.shift();
    }

    return results[0];
  },

  getDescriptions: function (content, data) {
    let toReturn = [];
    for (var condition in content) {
      if (descriptor.evaluate(condition, data)) {
        toReturn.push(content[condition]);
      }
    }

    return toReturn;
  },

  getAvailableDescs: function (descriptionList, data) {
    let toReturn = [];
    for (let conditionName in descriptionList) {
      if (descriptor.parseCondition(conditionName, data)) {
        toReturn.push(descriptionList[conditionName]);
      }
    }

    if (toReturn.length === 0) {
      throw new Error(`error no available descs : ${descriptionList} `);
    }
    return toReturn;
  },

  getDescription: function (contentName, contentList, data) {
    let reference = /@(\w*)(?=\W)/gm;
    let result;

    return descriptor.getAvailableDescs(contentList[contentName], data)[0].replace(reference, (match, p1) => descriptor.getDescription(p1, contentList, data));
  }
};

export default descriptor;
