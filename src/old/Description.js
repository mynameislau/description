define(['Utils'], function (Utils)
{
	'use strict';

	var Description = function ($condition, $type, $descsArray)
	{
		this.condition = $condition;
		this.type = $type;
		this.descsArray = $descsArray;
	};

	Description.prototype.getMatchingScore = function ($modifiers)
	{
		/* /[^&|]+/g */

		var conditionParsing = /([\w\.]*)([%<=>]*)(\w*\.*\w*)/;
		var match = conditionParsing.exec(this.condition);
		var fullModName = match[1];
		var modNamesArray = fullModName.split('.');
		var currObj = $modifiers;
		var condProperty;
		var currModName;
		for (var i = 0, modNamesLength = modNamesArray.length; i < modNamesLength - 1; i += 1)
		{
			currObj = currObj[modNamesArray[i]];
		}
		condProperty = currObj[modNamesArray[modNamesArray.length - 1]];
		
		if (match[3] !== '')
		{
			if (match[2] === '==' && condProperty === match[3])
			{
				return 0;
			}
			else if (
			   (match[2] === '<=' && Number(condProperty) <= Number(match[3])) ||
			   (match[2] === '>=' && Number(condProperty) >= Number(match[3])) ||
			   (match[2] === '<'  && Number(condProperty) <  Number(match[3])) ||
			   (match[2] === '>'  && Number(condProperty) >  Number(match[3])))
			{
				var diff = Math.abs(Number(match[3] - Number(condProperty)));
				return diff;
			}
			//comparison of the value as a percentage of the whole object
			else if (match[2][0] === '%')
			{
				var total = 0;
				for (var prctName in currObj)
				{
					total += Number(currObj[prctName]);
				}
				var propertyPrct = Number(condProperty) / total;
				var prctDiff = Math.abs(match[3] - propertyPrct);
				if (
				    (match[2] === '%<=' && propertyPrct <= match[3]) ||
				    (match[2] === '%>=' && propertyPrct >= match[3]) ||
				    (match[2] === '%<'  && propertyPrct <  match[3]) ||
				    (match[2] === '%>'  && propertyPrct >  match[3]))
				{
					return prctDiff;
				}
			}
		}
		else
		{
			if (condProperty !== undefined)
			{
				return 0;
			}
			else if (this.condition === '*')
			{
				return Infinity;
			}
		}

		return undefined;
	};

	Description.prototype.toString = function ()
	{
		return Utils.getRandom(this.descsArray);
	};

	return Description;
});