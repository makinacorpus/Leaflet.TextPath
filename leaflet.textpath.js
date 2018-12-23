/*
 * Leaflet.TextPath - Shows text along a polyline
 * Inspired by Tom Mac Wright article :
 * http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/
 */

(function () {

var __onAdd = L.Polyline.prototype.onAdd,
    __onRemove = L.Polyline.prototype.onRemove,
    __updatePath = L.Polyline.prototype._updatePath,
    __bringToFront = L.Polyline.prototype.bringToFront;

var _getLengthCache = {}

var PolylineTextPath = {

    onAdd: function (map) {
        __onAdd.call(this, map);
        this._textRedraw();
    },

    onRemove: function (map) {
        map = map || this._map;
        if (map && this._textNode && map._renderer._container)
            map._renderer._container.removeChild(this._textNode);
        __onRemove.call(this, map);
    },

    bringToFront: function () {
        __bringToFront.call(this);
        this._textRedraw();
    },

    _updatePath: function () {
        __updatePath.call(this);
        this._textRedraw();
    },

    _textRedraw: function () {
        var text = this._text,
            options = this._textOptions;
        if (text) {
            this.setText(null).setText(text, options);
        }
    },

    _getLength: function (text, options) {
        var cacheId = JSON.stringify(text) + '|' + JSON.stringify(options.attributes)

        if (cacheId in _getLengthCache) {
          return _getLengthCache[cacheId]
        }

        var svg = this._map._renderer._container;

        var pattern = L.SVG.create('text');
        for (var attr in options.attributes)
            pattern.setAttribute(attr, options.attributes[attr]);
        this._applyText(pattern, text);
        svg.appendChild(pattern);
        var length = pattern.getComputedTextLength();
        svg.removeChild(pattern);

        _getLengthCache[cacheId] = length

        return length;
    },

    setText: function (text, options) {
        this._text = text;
        this._textOptions = options;

        /* If not in SVG mode or Polyline not added to map yet return */
        /* setText will be called by onAdd, using value stored in this._text */
        if (!L.Browser.svg || typeof this._map === 'undefined') {
          return this;
        }

        var defaults = {
            repeat: false,
            fillColor: 'black',
            attributes: {},
            below: false,
            allowCrop: true
        };
        options = L.Util.extend(defaults, options);

        /* If empty text, hide */
        if (!text) {
            if (this._textNode && this._textNode.parentNode) {
                this._map._renderer._container.removeChild(this._textNode);
                
                /* delete the node, so it will not be removed a 2nd time if the layer is later removed from the map */
                delete this._textNode;
            }
            return this;
        }

        var id = 'pathdef-' + L.Util.stamp(this);
        var svg = this._map._renderer._container;
        this._path.setAttribute('id', id);

        var textLength = null;
        var pathLength = null;
        var finalText = [];
        var dx = 0

        if (!options.allowCrop) {
            if (textLength === null) {
                textLength = this._getLength(text, options);
            }
            if (pathLength === null) {
                pathLength = this._path.getTotalLength();
            }

            if (textLength > pathLength) {
                return this;
            }
        }

        if (options.repeat === false) {
            /* Center text according to the path's bounding box */
            if (options.center) {
                if (textLength === null) {
                    textLength = this._getLength(text, options);
                }

                /* Set the position for the left side of the textNode */
                dx = Math.max(0, (pathLength / 2) - (textLength / 2));
            }

            if (options.orientation === 'auto') {
                var poiBegin = this._path.getPointAtLength(dx)
                var poiEnd = this._path.getPointAtLength(dx + textLength)
                var leftToRight = poiEnd.x >= poiBegin.x

                if (leftToRight) {
                    finalText.push(text);
                } else {
                    finalText.push({ text: turnText(text), rotate: 180 });
                }
            } else {
                finalText = [ text ];
            }
        } else {
            if (options.orientation === 'auto') {
                var textTurned = turnText(text)
            }

            /* Compute single pattern length */
            if (textLength === null) {
              textLength = this._getLength(text, options);
            }
            if (pathLength === null) {
                pathLength = this._path.getTotalLength();
            }

            /* Compute length of a space */
            var slength = this._getLength('\u00A0', options);

            /* Create string as long as path */
            var repeatDistance = parseFloat(options.repeat) || 0
            var pos = 0
            var spacingBalance = 0
            var repeatCount = Math.floor((pathLength + repeatDistance) / (textLength + repeatDistance)) || 1;
            var finalText = []

            /* Calculate the position for the left side of the textNode */
            if (options.center) {
                dx = Math.max(0, (pathLength - textLength * repeatCount - repeatDistance * (repeatCount - 1))  / 2);
            }

            for (var i = 0; i < repeatCount; i++) {
                var spacesCount = 0
                if (i > 0) {
                    spacesCount = Math.round((repeatDistance + spacingBalance) / slength);
                    spacingBalance = repeatDistance - (spacesCount * slength);
                    pos += spacesCount * slength
                    finalText.push('\u00A0'.repeat(spacesCount));
                }

                if (options.orientation === 'auto') {
                    var poiBegin = this._path.getPointAtLength(pos)
                    var poiEnd = this._path.getPointAtLength(pos + textLength)
                    var leftToRight = poiEnd.x >= poiBegin.x

                    if (leftToRight) {
                        finalText.push(text);
                    } else {
                        finalText.push({ text: textTurned, rotate: 180 });
                    }
                } else {
                    finalText.push(text);
                }

                pos += textLength
            }
        }

        /* Put it along the path using textPath */
        var textNode = L.SVG.create('text'),
            textPath = L.SVG.create('textPath');

        var dy = options.offset || this._path.getAttribute('stroke-width');

        textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", '#'+id);
        textNode.setAttribute('dy', dy);
        for (var attr in options.attributes)
            textNode.setAttribute(attr, options.attributes[attr]);
        this._applyText(textPath, finalText);
        textNode.appendChild(textPath);
        this._textNode = textNode;

        if (dx !== 0) {
            textNode.setAttribute('dx', dx);
        }

        if (options.below) {
            svg.insertBefore(textNode, svg.firstChild);
        }
        else {
            svg.appendChild(textNode);
        }

        /* Change label rotation (if required) */
        if (options.orientation) {
            var rotateAngle = 0;
            switch (options.orientation) {
                case 'flip':
                    rotateAngle = 180;
                    break;
                case 'perpendicular':
                    rotateAngle = 90;
                    break;
                case 'auto':
                    rotateAngle = 0;
                    break;
                default:
                    rotateAngle = options.orientation;
            }

            var rotatecenterX = (textNode.getBBox().x + textNode.getBBox().width / 2);
            var rotatecenterY = (textNode.getBBox().y + textNode.getBBox().height / 2);
            textNode.setAttribute('transform','rotate(' + rotateAngle + ' '  + rotatecenterX + ' ' + rotatecenterY + ')');
        }

        /* Initialize mouse events for the additional nodes */
        if (this.options.clickable) {
            if (L.Browser.svg || !L.Browser.vml) {
                textPath.setAttribute('class', 'leaflet-clickable');
            }

            L.DomEvent.on(textNode, 'click', this._onMouseClick, this);

            var events = ['dblclick', 'mousedown', 'mouseover',
                          'mouseout', 'mousemove', 'contextmenu'];
            for (var i = 0; i < events.length; i++) {
                L.DomEvent.on(textNode, events[i], this._fireMouseEvent, this);
            }
        }

        return this;
    },

    _applyText: function(parentNode, text) {
        if (Array.isArray(text)) {
            text.forEach(function (part) {
                this._applyText(parentNode, part);
            }.bind(this));
        } else if (typeof text === 'object' && text !== null) {
            var tspan = L.SVG.create('tspan');
            parentNode.appendChild(tspan);

            for (var attr in text) {
                if (attr === 'text') {
                    this._applyText(tspan, text[attr]);
                } else {
                    tspan.setAttribute(attr, text[attr]);
                }
            }
        } else {
            text = text.replace(/ /g, '\u00A0');  // Non breakable spaces
            parentNode.appendChild(document.createTextNode(text));
        }
    }
};

L.Polyline.include(PolylineTextPath);

L.LayerGroup.include({
    setText: function(text, options) {
        for (var layer in this._layers) {
            if (typeof this._layers[layer].setText === 'function') {
                this._layers[layer].setText(text, options);
            }
        }
        return this;
    }
});

function turnText (text) {
    if (Array.isArray(text)) {
        return text
            .slice().reverse()
            .map(function (part) {
                return turnText(part)
            })
    } else if (typeof text === 'object' && text !== null) {
        var ret = {}
        for (var attr in text) {
            ret[attr] = text[attr]
        }
        ret.text = turnText(ret.text)
        return ret
    } else {
        return text.split('').reverse().join('')
    }
}

})();
