export default () => {
  let desc;
  let data = {
    toto: 'blue'
  };

  let parseContent = function (value) {
    let regex = /( *)(.+):\n((?:\1  .*[\s]?)*)/gm;
    let result;
    let parsed = {};

    do {
      result = regex.exec(value);
      if (!result) { break; }
      parsed[result[2]] = result[3];
    }
    while (result);
    // for(let name in parsed) {
    //   console.log(name);
    // }

    return parsed;
  };

  let parseExpression = function (expression, data) {
    console.log('parsing expression', expression);
    if (expression.startsWith('\'')) { return expression.replace(/'/g, ''); }
    else { return data[expression]; }
  };

  let evaluate = function (condition, data) {
    console.log('evaluate', condition);

    let comparison = /(\S*)?([=<>])(\S*)?/;
    let comparisonResult = comparison.exec(condition);

    if (comparisonResult) {
      let expressionA = parseExpression(comparisonResult[1], data);
      let operand = comparisonResult[2];
      let expressionB = parseExpression(comparisonResult[3], data);

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
      else { return parseExpression(condition, data) !== undefined && parseExpression(condition, data) !== false; }
    }
  };

  let stripFirstLevelParentheses = function (condition, data) {
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
  };

  let parseCondition = function (condition, data) {
    console.log('parsing condition', condition);
    let noSpace = condition.replace(/\s/g, '');
    return performComparisons(noSpace, data);
  };

  let performComparisons = function (condition, data) {
    console.log('performComparisons', condition);

    condition = stripFirstLevelParentheses(condition);

    let testCondition = /[\(\)&\|]/gm;
    if (!testCondition.test(condition)) { return evaluate(condition, data); }

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

    var results = groups.map(item => parseCondition(item, data));

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
  };

  let getDescriptions = function (content, data) {
    let toReturn = [];
    for (var condition in content) {
      if (evaluate(condition, data)) {
        toReturn.push(content[condition]);
      }
    }

    return toReturn;
  };

  let getAvailableDescs = function (descriptionList, data) {
    let toReturn = [];
    for (let conditionName in descriptionList) {
      if (parseCondition(conditionName, data)) {
        toReturn.push(descriptionList[conditionName]);
      }
    }

    if (toReturn.length === 0) {
      throw new Error('error no available descs : ${descriptionList} ');
    }
    return toReturn;
  };

  let getDescription = function (contentName, contentList, data) {
    let reference = /@(\w*)(?=\W)/gm;
    let result;

    return getAvailableDescs(contentList[contentName], data)[0].replace(reference, (match, p1) => {
      getDescription(p1, contentList, data);
    });
  };

  let reqListener = function () {
    desc = this.responseText;
    // console.log(desc);
    let parsedContent = parseContent(desc);
    for (let name in parsedContent) {
      parsedContent[name] = parseContent(parsedContent[name]);
    }

    //var condition = "(toto = 'blue' & 'green' = 'green') & 'red' = 'redd' | 'tutu' = 'tutu'";
    //var condition = 'toto';
    console.log('result', getDescription('body', parsedContent, data));
  };

  //pas mal : ^(\w+):([\s\S]*?)(?=(^\w))

  let oReq = new XMLHttpRequest();
  oReq.addEventListener('load', reqListener);
  oReq.open('GET', 'main.desc');
  oReq.send();
};
