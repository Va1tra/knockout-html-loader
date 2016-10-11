var DOMParser = require('xmldom').DOMParser;

function quotes(str) {
    return str.replace(/"/g, "\\\"");
}

function parseNode(node) {
    if (node.nodeType == 1) { // Element
        var out =
            `(function() {
            var node = createElement("${node.nodeName}");`;

        for (var i = 0; i < node.attributes.length; ++i) {
            out +=
                `setAttribute(node, "${node.attributes[i].name}", "${quotes(node.attributes[i].value)}");`;
        }

        for (var i = 0; i < node.childNodes.length; ++i) {
            if (node.childNodes[i].nodeType == 3 && node.childNodes[i].nodeValue.trim() == "") {
                continue;
            }

            out +=
                `appendChild(node, ${parseNode(node.childNodes[i])});`
        }

        out +=
            `return node;
        })()`;

        return out;
    } else if (node.nodeType == 3) { // Text
        return `createTextNode("${quotes(node.nodeValue)}")`;
    } else if (node.nodeType == 8) { // Comment
        return `createComment("${quotes(node.nodeValue)}")`;
    }
}

function html2dom(fileContent) {
    var parser = new DOMParser();
    var parsedTemplate = parser.parseFromString(fileContent);

    var out = `[`;

    for (var i = 0; i < parsedTemplate.childNodes.length; ++i) {
        if (i != 0) {
            out += `, `;
        }
        out += parseNode(parsedTemplate.childNodes[i]).replace(/\n/g, '');
    }

    out += `]`;

    out = // to increase efficiency of uglifier
        `(function() {
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
			
			return ${out};
		})()`;

    return out;
}

module.exports = function(content) {
    this.cacheable && this.cacheable();

    return 'module.exports = ' + html2dom(content).replace(/\r/g, '').replace(/\n/g, '') + ';';
};


