app.directive('ngInfiniteScroll', ['$window', '$interval', function($window, $interval) {
	return {
		template: '<li class="my-list-item" ng-repeat="item in items"><div class="my-list-inner">{{item.name}}</div></li>',
		restrict: 'A',
		replace: false,
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _$message = $('body').find('.message');
			var _$loader = $('body').find('.load-more');
			var _offset = _$window.height() - elem.height();
			var _trigger = _offset - (attrs.ngInfiniteScrollOffset ? attrs.ngInfiniteScrollOffset : 200);
			var _loading = true;
			var _selector = '.my-list-item';

			//  Methods
			var handleEvent = function (e, attrs) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'scroll':
						if (!_loading) monitorScrollPosition();
						break;
					case 'resize':
						// _offset = elem.height() - _$window.height();
						// if (!_loading) monitorScrollPosition();
						break;
					case 'loadComplete':
						_checkItemsHaveUpdated(attrs);
						break;
				}
			};
			var _checkItemsHaveUpdated = function (data) {
				/*  This is a horrible hack fix to ensure the DOM is ready for manipulation once data binding has occured.
				    the 'link' function we are currently in is fired when the template is cloned but not upon template render.
				    this would normally be fine for most manipulation but the grid need to instantaneously adjust on render  */
				var _$items = elem.find(_selector);
				var _checkDOM = $interval(function(){
					_$items = elem.find(_selector);
					if (_$items.length === data.length) {
						$interval.cancel(_checkDOM);
						_loading = false;
						_offset = elem.outerHeight() - _$window.height();
						_trigger = _offset - (attrs.ngInfiniteScrollOffset ? attrs.ngInfiniteScrollOffset : 200);
					}
				}, 1);
			};
			var monitorScrollPosition = function () {

				if (_$window.scrollTop() >= _trigger) {
					
					if (!_loading) {
						scope.$emit('loadMoreItems');
					}
					_loading = true;
					_$loader.show();
				}
				else {
					updateMessage(_offset + ' : ' + _$window.scrollTop() + ' : ' + _trigger);
					_$loader.hide();
				}
			};
			var updateMessage = function (str) {

				_$message.html(str);
			};

			//  Listeners
			_$window.on('scroll', handleEvent);
			_$window.on('resize', handleEvent);
			scope.$on('loadComplete', handleEvent);
		}
  };
}]);