var GeneType = function ($params)
{
  this.genes = [];
  this.geneDependency = $params.geneDep !== 'none' ? $params.geneDep : undefined;
};

export default GeneType;
