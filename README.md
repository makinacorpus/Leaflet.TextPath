Leaflet.TextPath
================

Shows a text along a Polyline.

Check out the [demo](http://makinacorpus.github.com/Leaflet.TextPath/) !

Leaflet versions
-----

The version on the `gh-pages` branch targets Leaflet 0.7.3.

Please use the `leaflet0.8-dev` branch to be compatible with the development version of Leaflet (0.8).

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

### Options

* `repeat` Specifies if the text should be repeated along the polyline (Default: `false`)
* `center` Centers the text according to the polyline's bounding box  (Default: `false`)
* `attributes` Object containing the attributes applied to the `text` tag. Check valid attributes [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text#Attributes) (Default: `{}`)
* `below` Show text below the path (Default: false)
* `rotate` Turn every character of the text 90 degrees to the right (Default: false)

Screenshot
----------

![screenshot](https://raw.github.com/makinacorpus/Leaflet.TextPath/master/screenshot.png)

Credits
-------

The main idea comes from Tom Mac Wright's *[Getting serious about SVG](http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/)*


Changelog
---------

### master ###

**Breaking changes**

* Set option ``below`` to true to put the text below the layer. It is shown
  on top by default.

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
