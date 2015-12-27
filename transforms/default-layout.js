export default function (file, api) {
  const j = api.jscodeshift

  const isProperty = p => {
    return (
      p.parent.node.type === 'Property' &&
      p.parent.node.key.type === 'Identifier' &&
      p.parent.node.key.name === 'defaultLayout'
    )
  }

  const checkCallee = node => {
    const types = (
      node.type === 'MemberExpression' &&
      node.object.type === 'MemberExpression' &&
      node.object.object.type === 'Identifier' &&
      node.object.property.type === 'Identifier' &&
      node.property.type === 'Identifier'
    )

    const identifiers = (
      node.object.object.name === 'Ember' &&
      node.object.property.name === 'Component' &&
      node.property.name === 'extend'
    )

    return types && identifiers
  }

  const isArgument = p => {
    if (p.parent.parent.parent.node.type === 'CallExpression') {
      const call = p.parent.parent.parent.node
      return checkCallee(call.callee)
    }
  }

  const replaceDefaultLayout = p => {
    p.node.name = 'layout'
    return p.node
  }

  return j(file.source)
    .find(j.Identifier, { name: 'defaultLayout' })
    .filter(isProperty)
    .filter(isArgument)
    .replaceWith(replaceDefaultLayout)
    .toSource();
}
