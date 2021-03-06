# angular-flatpickr-in-timezone

An angular directive to use [flatpickr](https://github.com/chmln/flatpickr).
Currently it has following capabilities
* setting init options using `fp-opts` attribute
* additional init option, 'timezone', to specify which timezone the date-time selected is in (otherwise assumed to be the user's computer timezone)
* on setup callback using `fp-on-setup` attribute to get the created flatpickr object

## Example

* install it with `npm install --save angular-flatpickr-in-timezone` or `bower install --save angular-flatpickr-in-timezone`

* Add the `ng-flatpickr-in-timezone` module in your app as

```js
var module = angular.module('atApp.somemodule', [
    'angular-flatpickr-in-timezone'
]);
```

* inside your controller set your default options and the post setup callback

```js
$scope.dateOpts = {
    dateFormat: 'Y-m-d\\TH:i:S', // e.g. '2017-03-23T06:05:00', '2017-03-23T14:25:00'
    defaultDate: '2017-03-23T06:05:00',
    altInput: true,
    altFormat: 'M J, Y H:i',
    enableTime: true,
    timezone: 'US/Chicago'
};

$scope.datePostSetup = function(fpItem) {
    console.log('flatpickr', fpItem);
}

```

In your view set the element as per your scope variables defined above
``` html
<div ng-repeat="date in dates">
    <input ng-flatpickr-in-timezone fp-opts="dateOpts" fp-on-setup="datePostSetup(fpItem)" ng-model="dateTime">
</div>
```


Note: This directive doesn't watch over the `fp-opts` values. For doing any changes to the flatpickr element created, use object returned from the on-setup callback


## License

angular-flatpickr-in-timezone module is under MIT license:

> Permission is hereby granted, free of charge, to any person
> obtaining a copy of this software and associated documentation files
> (the "Software"), to deal in the Software without restriction,
> including without limitation the rights to use, copy, modify, merge,
> publish, distribute, sublicense, and/or sell copies of the Software,
> and to permit persons to whom the Software is furnished to do so,
> subject to the following conditions:
>
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
> BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
> ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
