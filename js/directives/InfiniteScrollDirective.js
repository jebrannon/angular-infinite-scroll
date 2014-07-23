app.directive('ngInfiniteScroll', ['$window', function($window) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _$message = elem.find('.message');
			var _offset = elem.height() - _$window.height();
			var handleEvent;


			console.log(attrs);

			//  Listeners
			_$window.on('scroll', function(e) {
				handleEvent(e);
			});
			_$window.on('resize', function(e) {
				handleEvent(e);
			});

			//  Handle all events
			handleEvent = function (e) {
				switch(e.type) {
					case 'scroll':
						_$message.html(_offset + ' - ' + _$window.scrollTop());
						break;
					case 'resize':
						_offset = elem.height() - _$window.height();
						_$message.html(_offset + ' - ' + _$window.scrollTop());
						break;
				}
			}
		}
  };
}]);