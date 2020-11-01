
function XPathNodesIterator(helper, iterator) {
  this.helper = helper;
  this.iterator = iterator;
}

XPathNodesIterator.prototype.forEach = function (thunk) {
  var node = this.iterator.iterateNext();
  while (node) {
    thunk(new XPathHelper(this.helper.document, node, this.helper.nsResolver));
    node = this.iterator.iterateNext();
  }
}

XPathNodesIterator.prototype.map = function (cons) {
  var result = [];

  this.forEach(function (item) {
    result.push(cons(item));
  });

  return result;
}

export function XPathHelper(document, node, nsResolver) {
  this.document = document;
  this.node = node || this.document;
  this.nsResolver = nsResolver || this.document.createNSResolver(this.document);
}

XPathHelper.prototype.getNodes = function (expression) {
  return new XPathNodesIterator(this, this.document.evaluate(
    expression,
    this.node,
    this.nsResolver,
    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
    null
  ));
};

XPathHelper.prototype.getString = function (expression) {
  return this.document.evaluate(
    expression,
    this.node,
    this.nsResolver,
    XPathResult.STRING_TYPE,
    null
  ).stringValue;
}
