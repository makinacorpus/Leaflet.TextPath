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


var PolylineTextPath = {

    onAdd: function (map) {
        __onAdd.call(this, map);
        this._textRedraw();
    },

    onRemove: function (map) {
        map = map || this._map;
        if (map && this._textNode)
            map._pathRoot.removeChild(this._textNode);
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
        };
        options = L.Util.extend(defaults, options);

        /* If empty text, hide */
        if (!text) {
            if (this._textNode && this._textNode.parentNode) {
                this._map._pathRoot.removeChild(this._textNode);
                
                /* delete the node, so it will not be removed a 2nd time if the layer is later removed from the map */
                delete this._textNode;
            }
            return this;
        }

        text = text.replace(/ /g, '\u00A0');  // Non breakable spaces
        var id = 'pathdef-' + L.Util.stamp(this);
        var svg = this._map._pathRoot;
        this._path.setAttribute('id', id);

        if (options.repeat) {
            /* Compute single pattern length */
            var pattern = L.Path.prototype._createElement('text');
            for (var attr in options.attributes)
                pattern.setAttribute(attr, options.attributes[attr]);
            pattern.appendChild(document.createTextNode(text));
            svg.appendChild(pattern);
            var alength = pattern.getComputedTextLength();
            svg.removeChild(pattern);

            /* Create string as long as path */
            text = new Array(Math.ceil(this._path.getTotalLength() / alength)).join(text);
        }

        /* Put it along the path using textPath */
        var textNode = L.Path.prototype._createElement('text'),
            textPath = L.Path.prototype._createElement('textPath');

        var dy = options.offset || this._path.getAttribute('stroke-width');

        textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", '#'+id);
        textNode.setAttribute('dy', dy);
        for (var attr in options.attributes)
            textNode.setAttribute(attr, options.attributes[attr]);
        textPath.appendChild(document.createTextNode(text));
        textNode.appendChild(textPath);
        this._textNode = textNode;

        if (options.below) {
            svg.insertBefore(textNode, svg.firstChild);
        }
        else {
            svg.appendChild(textNode);
        }

        /* Center text according to the path's bounding box */
        if (options.center) {
            var textWidth = textNode.getBBox().width;
            var pathWidth = this._path.getBoundingClientRect().width;
            /* Set the position for the left side of the textNode */
            textNode.setAttribute('dx', ((pathWidth / 2) - (textWidth / 2)));
        }

        if (options.flipvertical) {   
		var rotatecenterX = (textNode.getBBox().x + textNode.getBBox().width / 2);
		var rotatecenterY = (textNode.getBBox().y + textNode.getBBox().height / 2);			
		textNode.setAttribute('transform', 'rotate(180 ' + rotatecenterX + ' ' + rotatecenterY + ')');			
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

/* Functions to compute line direction to correct text orientation
 * Note: only generic, in future could check each line segment.
 */

/* Calculate bearing between start and end of line */
function getBearing(Lat1, Lon1, Lat2, Lon2) {
  var dLon = Lon2.toRadians() - Lon1.toRadians();
  var dPhi = Math.log(Math.tan(Lat2.toRadians() / 2 + Math.PI/4) / Math.tan(Lat1.toRadians()/2 + Math.PI/4));
  if (Math.abs(dLon) > Math.PI){
    if (dLon > 0.0) {
      dLon = -(2.0 * Math.PI - dLon);
    } else {
      dLon = (2.0 * Math.PI + dLon);
    }
  }
  
  return (Math.atan2(dLon, dPhi)) + 360).toDegrees() % 360;
}

/* Convert bearing into a generic direction. Lines heading North or East should have their labels flipped */
function correctLabelOrientation (b) {
    if (b >= 45 && b =< 135) {
      return true; /* North */
    } else if (b >= 136 && b =< 225) {
      return true; /* East */
    } else if (b >= 226 && b =< 315) {
      return false; /* South */
    } else {
      return false; /* West */
    }
}

/* Convert Degrees to Radians */
Number.prototype.toRadians = function() { 
    return (this.valueOf() * Math.PI) / 180; 
} 

/* Convert Radians to Degrees */
Number.prototype.toDegrees = function() { 
    return this.valueOf() * (180 * Math.PI); 
} 

})();
