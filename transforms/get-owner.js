export default function (file, api, { polyfill }) {
  const j = api.jscodeshift
  const root = j(file.source)
  const { statement } = j.template

  const isThisContainer = p => {
    const { node } = p.parent
    return node.type === 'MemberExpression' && node.property.name === 'container'
  };

  const getOwner = p => {
    const callee = j.identifier('getOwner')
    const args = [ j.thisExpression() ]
    return j.callExpression(callee, args)
  }

  const declareGetOwner = p => {
    const { body } = p.node

    const isImports = node => node.type === 'ImportDeclaration'

    const imports = body.filter(isImports)
    const rest = body.filter(n => !isImports(n))

    let getOwnerDeclaration;

    if (polyfill) {
      getOwnerDeclaration = statement`import getOwner from 'ember-getowner-polyfill'`
    } else {
      getOwnerDeclaration = statement`const { getOwner } = Ember`
    }

    p.node.body = [ ...imports, getOwnerDeclaration, ...rest ]

    return p.node
  }

  // TODO How to remove this check??
  if (root.findThisContainer === undefined) {
    j.registerMethods({
      findThisContainer() {
        return (
          this.find(j.ThisExpression).filter(isThisContainer).map(p => p.parent)
        );
      }
    })
  }

  const didTransform = root.findThisContainer().replaceWith(getOwner).size()

  // TODO Handle the case when containter is destructred.

  if (didTransform > 0) {
    root.find(j.Program).replaceWith(declareGetOwner)

    return root.toSource({ quote: 'single' })
  }

  return null
}
