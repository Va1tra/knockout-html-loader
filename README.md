# knockout-html-loader
Webpack loader for converting html to js instructions that can be used as knockout template.

<h2>Install</h2>

```bash
npm i knockout-template-loader
```

<h2>Example</h2>

```js
{
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: "knockout-template"
      }
    ]
  }
}
```


```html
<!-- file.html -->
<div class="class1" id="id1" data-bind="click: clickMethod1">
    <!-- ko if: if1 -->
        <span class="class2">text</span>
    <!-- /ko -->
</div>
```

```js
require('./file.html');

// =>
(function() {
    var doc = document;

    function createElement(name) {
        return doc.createElement(name);
    }

    function setAttribute(node, name, value) {
        node.setAttribute(name, value);
    }

    function appendChild(node, child) {
        node.appendChild(child);
    }

    function createTextNode(text) {
        return doc.createTextNode(text);
    }

    function createComment(comment) {
        return doc.createComment(comment);
    }

    return [(function() {
        var node = createElement("div");
        setAttribute(node, "class", "class1");
        setAttribute(node, "id", "id1");
        setAttribute(node, "data-bind", "click: clickMethod1");
        appendChild(node, createComment(" ko if: if1 "));
        appendChild(node, (function() {
            var node = createElement("span");
            setAttribute(node, "class", "class2");
            appendChild(node, createTextNode("text"));
            return node;
        })());
        appendChild(node, createComment(" /ko "));
        return node;
    })()];
})()
```