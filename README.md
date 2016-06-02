# angulartics-tealium
![travis build](https://api.travis-ci.org/autotraderuk/angulartics-tealium.svg)

A plugin for [Angulartics](https://github.com/angulartics/angulartics) to send page and event tracking events using [Tealium iQ](http://tealium.com/products/tealium-iq-tag-management-system).

Installation
------------

#### Requirements

[Angulartics](https://github.com/angulartics/angulartics) needs to be installed and setup first

#### Install with npm

`npm install -S angulartics-tealium`

Require the module in your code

`require('angulartics-tealium');`

Add `'angulartics.tealium'` to your angular app dependencies, e.g.
 
```js
angular.module('my.app', [
  'angulartics',
  'angulartics.tealium'
]);
```

#### Setup

In order for the plugin to access your tags it needs to load Tealium's utag.js. Trigger this in your app's run block, before any page loads take place.

```js
app.run(function(UtagService) {
  UtagService.load({
    organisation: 'my-org',
    application: 'my-app',
    environment: 'dev'
  });
});

```

License
-------

The MIT License (MIT)

Copyright (c) 2016 Auto Trader Limited

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
