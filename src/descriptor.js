let descriptor = {

  parseDescriptionsFile: function (file, data) {
    let parsedContent = descriptor.parseContent(file);
    for (let name in parsedContent) {
      parsedContent[name] = descriptor.parseContent(parsedContent[name]);
    }

    //var condition = "(toto = 'blue' & 'green' = 'green') & 'red' = 'redd' | 'tutu' = 'tutu'";
    //var condition = 'toto';

    return descriptor.getDescription('root', parsedContent, data);
    //console.log('result', descriptor.getDescription('body', parsedContent, data));
  },

  parseContent: function (value) {
    // let regex = /( *)(.+):\n((?:\1  .*[\s]?)*)/gm;
    //let regex = /( *)(.+):\n((?:\1\s.*[\s]?)*)/gm;

    // celle la fonctionne dans regexr : /^( *)(.+):$\n((?:(?:^\1 .*\n?)|^$\n?)*)/gm
    let regex = /(^ *)(.*):(.*)$\s?((?:(?:^\1 .*$\s?)|(?:^$\s))*)/gm;
    let result;
    let parsed = {};

    do {
      result = regex.exec(value);
      if (!result) { break; }
      let content = result[3] + result[4];
      content = content.replace(/^  /gm, '');
      content = content.replace(/\n$/, '');
      parsed[result[2]] = content;
      //console.log(result);
    }
    while (result);
    // for(let name in parsed) {
    //   console.log(name);
    // }

    return parsed;
  },

  getExpressionValue: function (expression, data) {
    //console.log('parsing expression', expression);
    var parentObject = data;
    var value;

    if (expression.startsWith('\'')) { value = expression.replace(/'/g, ''); }
    else if (!isNaN(expression)) { value = Number(expression); }
    else {
      while (expression.includes('.'))
      {
        expression = expression.replace(/(.*)\./, (match, p1) => {
          parentObject = parentObject[p1];
          return '';
        });
      }

      //console.log(expression, parentObject);
      value = parentObject[expression];
      if (!isNaN(value)) { value = Number(value); }
    }

    return { value: value, parentObject: parentObject };
  },

  percentageEvaluation: function (value, percentageToCompareTo, parentObject, operand) {
    //console.log(value, percentageToCompareTo);
    value = Number(value);
    percentageToCompareTo = Number(percentageToCompareTo) / 100;
    let total = 0;
    for (let prctName in parentObject)
    {
      total += Number(parentObject[prctName]);
    }
    let valuePercentage = value / total;
    let prctDiff = Math.abs(percentageToCompareTo - valuePercentage);
    if (
        (operand === '%='  && valuePercentage === percentageToCompareTo) ||
        (operand === '%<=' && valuePercentage <=  percentageToCompareTo) ||
        (operand === '%>=' && valuePercentage >=  percentageToCompareTo) ||
        (operand === '%<'  && valuePercentage <   percentageToCompareTo) ||
        (operand === '%>'  && valuePercentage >   percentageToCompareTo))
    {
      return true;
    }
    return false;
  },

  evaluate: function (condition, data) {
    //console.log('evaluate', condition);
    if (condition === '*') { return true; }

    let comparison = /(.*?)?([%=<>]+)(.*)?/;
    let comparisonResult = comparison.exec(condition);
    //console.log(comparisonResult);

    if (comparisonResult) {
      let expressionAData = descriptor.getExpressionValue(comparisonResult[1], data);
      let operand = comparisonResult[2];
      let expressionBData = descriptor.getExpressionValue(comparisonResult[3], data);

      //console.log(condition, expressionAData, operand, expressionBData);

      switch (operand) {
        case '>':
          return expressionAData.value > expressionBData.value;

        case '<':
          return expressionAData.value < expressionBData.value;

        case '=':
          return expressionAData.value === expressionBData.value;

        case '%=':
        case '%<':
        case '%>':
        case '%>=':
        case '%<=':
          return descriptor.percentageEvaluation(expressionAData.value, expressionBData.value, expressionAData.parentObject, operand);

        default:
          throw new Error('invalid evaluation');
      }
    }
    else {
      return descriptor.getExpressionValue(condition, data).value !== undefined && descriptor.getExpressionValue(condition, data).value !== false;
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

  // getDescriptions: function (content, data) {
  //   let toReturn = [];
  //   for (var condition in content) {
  //     if (descriptor.evaluate(condition, data)) {
  //       toReturn.push(content[condition]);
  //     }
  //   }

  //   return toReturn;
  // },

  getAvailableDescs: function (descriptionList, data) {
    let toReturn = [];
    for (let conditionName in descriptionList) {
      if (descriptor.parseCondition(conditionName, data)) {
        toReturn.push(descriptionList[conditionName]);
      }
    }
    return toReturn;
  },

  getDescription: function (contentName, contentList, data) {
    let reference = /@(\w*)(?=\W)?/gm;
    let result;

    var availableDescs = descriptor.getAvailableDescs(contentList[contentName], data);
    // [0] is temporary
    if (availableDescs.length > 0) { return availableDescs[0].replace(reference, (match, p1) => descriptor.getDescription(p1, contentList, data)); }
    else {
      return window.debug ? `(no description for ${contentName})` : '';
    }
  }
};

export default descriptor;
