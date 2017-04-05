(function(root, factory) {
    'use strict';

    function isUndefinedOrNull(val) {
        return angular.isUndefined(val) || val === null;
    }

    function requireMoment() {
        try {
            return require('moment-timezone');
        } catch (e) {
            throw new Error('Please install moment and moment-timezome and require/import them into your angular project');
        }
    }

    root['angular-flatpickr-in-timezone'] = factory(root.angular, root.flatpickr, root.moment);
}(this, function(angular, flatpickr, moment) {
    'use strict';

    if (typeof moment === 'undefined') {
        if (typeof require === 'function') {
            moment = requireMoment();
        } else {
          throw new Error('Moment cannot be found');
        }
    }

    var ngFlatpickrInTimezone = angular.module('angular-flatpickr-in-timezone', []);

    ngFlatpickrInTimezone.directive('ngFlatpickrInTimezone', function($rootScope, $parse) {
        return {
            restrict : 'A',
            link : function(scope, element, attrs) {
                var fpOpts = $parse(attrs.fpOpts)(scope);
                fpOpts.defaultDate = $parse(attrs.ngModel)(scope);

                /**
                 * Date Formatting
                 * @param  {String} format - pattern with which to format the date as a string (https://chmln.github.io/flatpickr/formatting/)
                 * @param {Date} dateObj - a javascript Date object
                 * @returns {String}
                 */
                fpOpts.formatDate = function(dateObj, format) {
                    var chars = format.split('');
                    var flatpickrFormats = Flatpickr.prototype.formats;

                    // Adapted from flatpickr source
                    var dateString = chars.map(function(c, i) {
                        if (flatpickrFormats[c] && chars[i - 1] !== '\\') {
                            return flatpickrFormats[c](dateObj);
                        } else {
                            return c !== '\\' ? c : '';
                        }
                    }).join('');

                    // Custom functionality to support designated timezones
                    // input/model value returns UTC value of a date-time selected in the designated timezone
                    if (fpOpts.timezone) {
                        var timezone = fpOpts.timezone || 'UTC';
                        var utcMoment;
                        if (format === fpOpts.dateFormat) {
                            // If we are formatting the input/model value:
                            // We ignore the dateString generated above and convert the dateObj to UTC time
                            utcMoment = moment.utc(dateObj)
                                            // The above conversion assumes dateObj is in the browser's timezone
                                            // and will subtract the browser's utcOffset from the date-time.
                                            // We reverse this by adding back the browser's utcOffset in minutes
                                            .add(moment(dateObj).utcOffset(), 'minutes');

                            // We now have the selected date-time as if it were selected in UTC
                            // What we actually want is the selected date-time as if it were selected in fpOpts.timezone
                            // To simulate this, we subtract that timezone's utcOffset in minutes
                            // And we return this adjusted UTC value
                            // Later, if we were to display this UTC value in the relevant timezone, the subtracted minutes would be restored
                            utcMoment = utcMoment.subtract(utcMoment.tz(timezone).utcOffset(), 'minutes');

                            return utcMoment.format(); // e.g. "2017-03-27T04:00:00.000Z"

                        } else if (format === fpOpts.altFormat) {
                            // If we are formatting the input element's display value:
                            // We'll keep the dateString as-is, then append the appropriate timezone abbreviation
                            utcMoment = moment.utc(dateObj) // Convert the dateObj to UTC time
                                            // Add the browser's utcOffset in minutes
                                            .add(moment(dateObj).utcOffset(), 'minutes');

                            var timezoneAbbr = utcMoment
                                            // Subtract facility timezone's utcOffset in minutes
                                            .subtract(utcMoment.tz(timezone).utcOffset(), 'minutes')
                                            // Convert to facility timezone, which adds back the minutes from above
                                            .tz(timezone)
                                            // Format simply as 'z' to get the timezone abbreviation
                                            // Depending on the date-time resulting from the above adjustments,
                                            // this abbreviation may or may not be the daylight savings time version of the timezone abbreviation
                                            .format('z');

                            return dateString + ' ' + timezoneAbbr;
                        } else {
                            return dateString;
                        }
                    }
                    return dateString;
                };

                var flatPickr = new Flatpickr(element[0], fpOpts);
                return flatPickr;
            }
        };
    });

    return ngFlatpickrInTimezone;

}));