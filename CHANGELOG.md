Next version / Unreleased
==================

  * Update changelog and demo page
  * Fix this._map._renderer unedefined if using panes (#87)

1.2.3 / 2020-02-07
==================

  * Fix mouse events

1.2.2 / 2020-02-07
==================

  * Fix mouse events
  * Fix repeated text on 0 length path

1.2.1 / 2018-06-22
==================

  * Update logo and turn links to https
  * Add example html page charset (utf8)

1.2.0 / 2018-03-01
==================

  * Add npm script to help releasing package versions
  * Set Leaflet as peerDependency
  * Upgrade Leaflet version from demo to `1.3.1`
  * Don't try to remove from container if container doesn't exist
  * Change way of dealing with the SVG to comply with leaflet >= 0.8
  * Remove useless console.log

1.1.0 / 2016-05-19
==================

  * Add the orientation option (#27, thanks @kirkau)

1.0.2 / 2016-03-14
==================

  * Allow HTTP and HTTPS to access the demo (#39, thanks @sonny89 and @leplatrem)

1.0.1 / 2016-02-05
==================

  * Fix text centering for vertical lines (#33, #34, #38, thanks @msgoloborodov)

1.0.0 / 2016-01-16
==================

**Breaking changes**

  * Text is now shown on top by default. Set option ``below`` to true to put the text below the layer.

0.2.2 / 2014-08-14
==================

  * Fix bug when removing layer whose text was removed (fixes #18) (thanks Victor Gomes)
  * Fix path width when using options.center (fixes #17) (thanks Brent Miller).

0.2.1 / 2014-06-01
==================

  * Fix layer order (fixes #5) (thanks Albin Larsson)

0.2.0 / 2014-02-04
==================

  * Stay on top after bringToFront
  * Clean-up and fix `onAdd` and `onRemove`
  * Fire mouse events from underlying text layer (thanks Lewis Christie)

0.1.0  / 2013-04-11
===================

  * Initial working version
