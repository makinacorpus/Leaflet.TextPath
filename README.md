Leaflet.TextPath
================

Shows a text along a Polyline.

Check out the [demo](http://makinacorpus.github.com/Leaflet.TextPath/) !

Usage
-----

For example, show path orientation on mouse over :

```
    var layer = L.polyLine(...);
    
    layer.on('mouseover', function () {
        this.setText('  ►  ', {repeat: true, attributes: {fill: 'red'}});
    });

    layer.on('mouseout', function () {
        this.setText(null);
    });
```

Screenshot
----------

![screenshot](https://raw.github.com/makinacorpus/Leaflet.TextPath/master/screenshot.png)

Credits
-------

The main idea comes from Tom Mac Wright's *[Getting serious about SVG](http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/)*

Authors
-------

[![Makina Corpus](http://depot.makina-corpus.org/public/logo.gif)](http://makinacorpus.com)
