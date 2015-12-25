export default function (file, api) {
  const j = api.jscodeshift

  return j(file.source)
    .find(j.ObjectExpression)
    .replaceWith(p => {
    	const { properties } = p.node;
     	Object.keys(properties).forEach(property => {
        if (properties[property].key.name === 'defaultLayout') {
			     properties[property].key.name = 'layout'
        }
      })

    	return p.node;
  	})
    .toSource();
}
