# http-redirect-behaviour
A behavior used with BeamJS framework to redirect http/s requests with or without rules.

## Installation

```
npm install http-redirect-behaviour
```

## Usage

```js
require('http-redirect-behaviour')({

  name: 'redirectLocalHost',
  destination: 'http://localhost:1430'
});
```