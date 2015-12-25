export default function (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const transformArity = node => {
    if (node.params.length === 2) {
      if (j(node.body).find(j.Identifier, { name: node.params[0].name }).size() === 0) {
        node.params = [ node.params[1] ];
      } else {
        console.log("You have access container in the initialize fn");
        console.log("Checkout this file", file.path);
      }
    }
  }

  const hasKey = (object, key) => {
    const { properties } = object;
    return properties.some(property => property.key.name === key);
  }

  const isIntializer = p => {
    return hasKey(p.node, 'name') && hasKey(p.node, 'initialize')
  }

  const findInitialize = p => {
    const { properties } = p.node
    const [ initialize ] = properties.filter(property => property.key.name === 'initialize');

    return initialize
  }

  const isIntializeMethod = p => {
    const type = findInitialize(p).value.type
    return type === 'FunctionExpression' || type === 'ArrowFunctionExpression'
  }

  const isIntializeIdentifier = p => {
    const type = findInitialize(p).value.type
    return type === 'Identifier'
  }

  j.registerMethods({
    findInitializer() {
      return (
        this.find(j.ObjectExpression).filter(isIntializer)
      );
    },
    findInitializeMethod() {
      return (
        this.findInitializer().filter(isIntializeMethod)
      );
    },
    findInitializeIdentifier() {
      return (
        this.findInitializer().filter(isIntializeIdentifier)
      );
    }
  })

  const didTransform1 = root.findInitializeMethod().replaceWith(p => {
    const method = findInitialize(p).value;
    transformArity(method);
    return p.node;
  }).size()

  const didTransform2 = root.findInitializeIdentifier().replaceWith(p1 => {
    const name = findInitialize(p1).value.name;

    root.findVariableDeclarators(name).replaceWith(p2 => {
      transformArity(p2.node.init);
      return p2.node
    })

    root.find(j.FunctionDeclaration, { id : { name } }).replaceWith(p3 => {
      transformArity(p3.node);
      return p3.node;
    })

    return p1.node
  }).size()

  if (didTransform1 + didTransform2 > 0) {
    return root.toSource();
  }

  return null
}
