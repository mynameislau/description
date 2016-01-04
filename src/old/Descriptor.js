define(['jquery', 'handlebars', 'Utils', 'Description'], function ($, Handlebars, Utils, Description)
{
	'use strict';

	var Descriptor = function ($descriptionsJSON, $descriptionTemplateXML, $changesTemplateXML, $helpers)
	{
		this.descriptionData = {};
		for (var descTypeName in $descriptionsJSON)
		{
			var descType = $descriptionsJSON[descTypeName];

			this.descriptionData[descTypeName] = [];

			for (var conditionString in descType)
			{
				var desc = new Description(conditionString, descTypeName, descType[conditionString]);
				this.descriptionData[descTypeName].push(desc);
			}
		}

		this.descriptionTemplateXML = $descriptionTemplateXML;
		this.changesTemplateXML = $changesTemplateXML;
		this.helpers = $helpers;
	};

	Descriptor.prototype.getData = function ($geneSet)
	{
		var templateData = {};
		var modifiers = $geneSet.getModifiers();

		var closest;
		for (var descTypeName in this.descriptionData)
		{
			closest = undefined;
			var descType = this.descriptionData[descTypeName];
			var closestScore = Infinity;
			for (var i = 0, descLength = descType.length; i < descLength; i += 1)
			{
				var currDesc = descType[i];
				//looking for the most suitable description
				var currScore = currDesc.getMatchingScore(modifiers);
				if (currScore <= closestScore)
				{
					closest = currDesc;
					closestScore = currScore;
				}
			}

			//templateData[descTypeName] = closest === undefined ? '*' + descTypeName + '*' : closest;
			templateData[descTypeName] = closest;
		}
		
		templateData.modifiers = modifiers;
		//console.log(templateData);

		return templateData;
	};

	Descriptor.prototype.getChanges = function ($oldGeneSet, $newGeneSet)
	{
		var templateData = this.getData($oldGeneSet);
		var newTemplateData = this.getData($newGeneSet);

		var changes = false;

		for (var dataName in templateData)
		{
			templateData[dataName + '1'] = templateData[dataName];
		}

		for (dataName in newTemplateData)
		{
			var newData = newTemplateData[dataName];
			//console.log(newData);
			var oldData = templateData[dataName];
			if (oldData !== newData)
			{
				templateData[dataName + '2'] = newData;
				templateData[dataName] = newData;
				//console.log('changes :', dataName);
				changes = true;
			}
		}

		if (changes === false)
		{
			templateData.nothingChanges = true;
		}

		console.log(templateData);

		var changesTemplate = Handlebars.compile(this.changesTemplateXML);
		return changesTemplate(templateData);
	};

	Descriptor.prototype.getDescription = function ($creature)
	{
		var templateData = this.getData($creature.geneSet);

		//console.log(templateData);
		
		var descriptionTemplate = Handlebars.compile(this.descriptionTemplateXML);
		return descriptionTemplate(templateData);
	};

	return Descriptor;
});