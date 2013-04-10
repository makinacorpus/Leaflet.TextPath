/*
 * Inspired by Tom Mac Wright article :
 * http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/
 */

var PolylineTextPath = {
    setText: function (text, options) {
        var defaults = {repeat: false, fillColor: 'black'};
        options = L.Util.extend(defaults, options);
        /* If empty text, hide */
        if (!text) {
            if (this._textNode)
                this._map._pathRoot.removeChild(this._textNode);
            return this;
        }

        var id = 'pathdef-' + L.Util.stamp(this);
        var svg = this._map._pathRoot;
        this._path.setAttribute('id', id);

        if (options.repeat) {
            /* Compute single pattern length */
            var pattern = L.Path.prototype._createElement('text');
            pattern.appendChild(document.createTextNode(text));
            svg.appendChild(pattern);
            var alength = pattern.getComputedTextLength();
            svg.removeChild(pattern);

            /* Create string as long as path */
            text = new Array(Math.floor(this._path.getTotalLength() / alength)).join(text);
        }

        /* Put it along the path using textPath */
        var textNode = L.Path.prototype._createElement('text'),
            textPath = L.Path.prototype._createElement('textPath');
        textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", '#'+id);
        textNode.setAttribute('fill', options.fillColor);
        textNode.setAttribute('dy', this._path.getAttribute('stroke-width')-1);
        textPath.appendChild(document.createTextNode(text));
        textNode.appendChild(textPath);
        svg.appendChild(textNode);
        this._textNode = textNode;
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
