Leaflet.TextPath
================

Shows a text along a Polyline.

Check out the [demo](http://makinacorpus.github.com/Leaflet.TextPath/) !

Leaflet versions
-----

The version on the `gh-pages` branch targets Leaflet `1.3.1`.

Usage
-----

For example, show path orientation on mouse over :

```javascript
    var layer = L.polyLine(...);

    layer.on('mouseover', function () {
        this.setText('  ►  ', {repeat: true, attributes: {fill: 'red'}});
    });

    layer.on('mouseout', function () {
        this.setText(null);
    });
```

With a GeoJSON containing lines, it becomes:

```javascript
    L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.setText(feature.properties.label);
        }
    }).addTo(map);

```

You can also apply attributes only to parts of the text, e.g. to create multi colored labels:

```javascript
layer.setText([
  { fill: 'red', text: 'Red' },
  ' '
  { style: 'fill: blue', text: 'Blue' }
])
```

### `text` parameter
The `text` parameter of `setText()` can either be:
* A string: use this string as label
* An object: use value of key 'text' as content (which can be either string, object or array), other key/value pairs as attributes for a `tspan` SVG node.
* An array: The label consists of several parts, where each part can either be a string, an object or an array.

### Options

* `repeat` Specifies if the text should be repeated along the polyline (Default: `false`). Specify `repeat` as float to set the distance between each repetition in pixels (will be approximated by spaces).
* `center` Centers the text according to the polyline's bounding box  (Default: `false`)
* `below` Show text below the path (Default: false)
* `offset` Set an offset to position text relative to the polyline (Default: width of stroke)
* `orientation` Rotate text.  (Default: 0)
    - {orientation: angle} - rotate to a specified angle (e.g. {orientation: 15})
    - {orientation: flip} - flips the text 180deg correction for upside down text placement on west -> east lines
    - {orientation: perpendicular} - places text at right angles to the line.
    - {orientation: auto} - flips the text on (part of) ways running west to east, so that they are readable upside down.
* `allowCrop` If the line is too short to display the whole text, crop the text. If false, don't show the text at all. (Default: true).
* `turnedText` When orientation=auto is used, use this text for east -> west lines.

* `attributes` Object containing the attributes applied to the `text` tag. Check valid attributes [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text#Attributes) (Default: `{}`)

Screenshot
----------

![screenshot](https://raw.github.com/makinacorpus/Leaflet.TextPath/gh-pages/screenshot.png)

Credits
-------

The main idea comes from Tom Mac Wright's *[Getting serious about SVG](http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/)*


Changelog
---------

### development ###

* Nothing changed yet.

### 1.1.0 ###

* Add the orientation option (#27, thanks @kirkau)

### 1.0.2 ###

* Allow HTTP and HTTPS to access the demo (#39, thanks @sonny89 and @leplatrem)

### 1.0.1 ###

* Fix text centering for vertical lines (#33, #34, #38, thanks @msgoloborodov)

### 1.0.0 ###

**Breaking changes**

* Text is now shown on top by default. Set option ``below`` to true to put the text below the layer.

### 0.2.2 ###

* Fix bug when removing layer whose text was removed (fixes #18) (thanks Victor Gomes)
* Fix path width when using options.center (fixes #17) (thanks Brent Miller).

### 0.2.1 ###

* Fix layer order (fixes #5) (thanks Albin Larsson)

### 0.2.0 ###

* Stay on top after bringToFront
* Clean-up and fix `onAdd` and `onRemove`
* Fire mouse events from underlying text layer (thanks Lewis Christie)

### 0.1.0 ###

* Initial working version



Authors
-------

Many thanks to [all contributors](https://github.com/makinacorpus/Leaflet.TextPath/graphs/contributors) !

[![Makina Corpus](http://depot.makina-corpus.org/public/logo.gif)](http://makinacorpus.com)
