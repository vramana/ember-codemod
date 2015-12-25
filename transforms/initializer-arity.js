export default function (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const hasKey = (object, key) => {
    const { properties } = object;
    return properties.some(property => property.key.name === key);
  }

  const transformFunction = fnNode => {
    if (fnNode.params.length === 2) {
      if (j(fnNode.body).find(j.Identifier, { name: 'container' }).size() === 0) {
        fnNode.params = [ fnNode.params[1] ];
      } else {
        console.log("You have access container in the initialize fn");
        console.log("Checkout this file", file.path);
      }
    }
  }

  const changeArity = p => {
    const { node } = p
    if (hasKey(node, 'name') && hasKey(node, 'initialize')) {
      const [ initialize ] = node.properties.filter(property => property.key.name === 'initialize')

      if (initialize.value.type === 'FunctionExpression' || initialize.value.type === 'ArrowFunctionExpression') {
        transformFunction(initialize.value)
      } else if (initialize.value.type === 'Identifier') {
        root.find(j.FunctionDeclaration, { id : { name:  initialize.value.name }})
          .replaceWith(p => {
            transformFunction(p.node)
            return p.node;
          });

        root.findVariableDeclarators(initialize.value.name).
          replaceWith(p => {
            transformFunction(p.node.init)
            return p.node;
          });
      }
    }

    return p.node
  }

  return (
    root.find(j.ObjectExpression)
      .replaceWith(changeArity)
      .toSource()
  )
}
