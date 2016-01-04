define(['dna/Gene', 'handlebars'], function (Gene, Handlebars)
{
	'use strict';

	var Helpers = function ($geneBank)
	{
		Helpers.geneBank = $geneBank;
		/*
		geneBank = $geneBank;
		specieBank = $specieBank;
*/

		for (var name in Helpers)
		{
			Handlebars.registerHelper(name, Helpers[name]);
		}
	};

	Helpers.ifand = function ($condition1, $conditionType, $condition2, $options)
	{
		if ($conditionType === '&&' && $condition1 !== undefined && $condition2 !== undefined)
		{
			return $options.fn(this);
		}
		if ($conditionType === '||' && ($condition1 !== undefined || $condition2 !== undefined))
		{
			return $options.fn(this);
		}
		return $options.inverse(this);
	};

	Helpers.ifis = function ($modifier, $comparator, $compared, $options)
	{
		var flag = false;
		/*var regEx = /([!<=>]*)(\w*.\w)/;
		var match = regEx.exec($comparison);*/

		var isNumber = typeof $compared === 'number' ? true : /\d*.?\d/.test($compared);
		var toCompare = isNumber ? Number($compared) : $compared;

		switch ($comparator)
		{
			case '<=' :
				flag = $modifier <= toCompare;
				break;
			case '>=' :
				flag = $modifier >= toCompare;
				break;
			case '>' :
				flag = $modifier > toCompare;
				break;
			case '<' :
				flag = $modifier < toCompare;
				break;
			case '!=' :
				flag = $modifier !== toCompare;
				break;
			case '==' :
				flag = $modifier === toCompare;
				break;
			default :
			case '===' :
				flag = $modifier === toCompare;
				break;
		}

		if (flag)
		{
			return $options.fn(this);
		}
		
		return $options.inverse(this);
	};

	Helpers.getSpecie = function ($type, $options)
	{
		for (var name in this.modifiers)
		{
			var currMod = this.modifiers[name];
			if (currMod instanceof Gene)
			{
				var currGene = currMod;
				if (currGene.type === $type)
				{
					for (var modName in currGene.mods.species)
					{
						return modName;
					}
				}
			}
		}
	};

	Helpers.getPercentages = function ($modifiers)
	{
		var percents = {};
		var total = 0;
		for (var name in $modifiers)
		{
			total += Number($modifiers[name]);
		}
		for (name in $modifiers)
		{
			percents[name] = Number($modifiers[name]) / total;
		}
		return percents;
	};

	Helpers.mainSpecie = function ($specieName, $options)
	{
		var percents = this.getSpeciesPercentages();
		if (percents[$specieName] > 0.5)
		{
			return $options.fn(this);
		}
		else
		{
			return '';
		}
	};

	Helpers.mention = function ($trait, $options)
	{
		if ($trait === undefined)
		{
			return $options.inverse(this);
		}
		
		var highest = '';

		var gene = Helpers.geneBank.getGeneByName($trait.condition);
		
		var percents = Helpers.getPercentages(this.modifiers.species);

		for (var name in percents)
		{
			highest = percents[name] < percents[highest] ? highest : name;
		}
		console.log(highest, percents[highest]);
		var specieGenes = Helpers.geneBank.getGenesFromTags([highest]);
		if (Number(percents[highest]) < 0.7 || specieGenes.indexOf(gene) === -1)
		{
			return $options.fn(this);
		}

		return $options.inverse(this);
	};

	Helpers.s = function ($desc, $verb, $options)
	{
		if ($desc[$desc.length - 1] !== 's')
		{
			return $desc + ' ' + $verb + 's';
		}
		else
		{
			return $desc + ' ' + $verb;
		}
	};

	Helpers.a = function ($desc, $options)
	{
		if ($desc === undefined)
		{
			return '';
		}

		var word = $desc.toString();

		var firstLetter = word[0];
		if (/[aeiou]/.test(firstLetter))
		{
			return 'an ' + word;
		}
		else
		{
			return 'a ' + word;
		}
	};

	Helpers.chgSknBrght = function ($options)
	{
		if (Number(this.modifiers.sknBrght) > Number(this.modifiers2.sknBrght))
		{
			return 'gets clearer';
		}
		else if (Number(this.modifiers.sknBrght) < Number(this.modifiers2.sknBrght))
		{
			return 'darkens';
		}
		else
		{
			return 'changes';
		}
	};

	return Helpers;
});