Leaflet.TextPath
================

Shows a text along a Polyline.

<p align="center">
<a href="https://www.npmjs.com/package/leaflet-textpath"><img alt="npm" src="https://img.shields.io/npm/dt/leaflet-textpath"></a>
<a href="https://www.npmjs.com/package/leaflet-textpath"><img alt="npm" src= "https://img.shields.io/npm/v/leaflet-textpath?color=red"></a>
</p>

<div class="demo">
<p align="center"><img src="./screenshot.png"></p>
<p align="center">Check out the <a href="https://makinacorpus.github.io/Leaflet.TextPath/">demo</a> ! </p>
</div>

Install
-----
install it via your favorite package manager:

`npm i leaflet-textpath`

Leaflet versions
-----

The version on the github page (demo) currently targets Leaflet `1.3.1`.

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
* `below` Show text below the path (Default: false)
* `offset` Set an offset to position text relative to the polyline (Default: 0)
* `orientation` Rotate text.  (Default: 0)
    - {orientation: angle} - rotate to a specified angle (e.g. {orientation: 15})
    - {orientation: flip} - filps the text 180deg correction for upside down text placement on west -> east lines
    - {orientation: perpendicular} - places text at right angles to the line.

* `attributes` Object containing the attributes applied to the `text` tag. Check valid attributes [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text#Attributes) (Default: `{}`)

Credits
-------

The main idea comes from Tom Mac Wright's *[Getting serious about SVG](https://web.archive.org/web/20130312131812/http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/)*

Authors
-------

Many thanks to [all contributors](https://github.com/makinacorpus/Leaflet.TextPath/graphs/contributors) !

[![Makina Corpus](https://geotrek.fr/assets/img/logo_makina.svg)](http://makinacorpus.com)
