var AppRouter = Backbone.Router.extend({
	routes: {
		"submit": "submitScreen",
		"view": "viewScreen",
		"": "viewScreen",
		"admin/edit" : "editScreen"
	},
	
	initialize: function  () {
		
	$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
});

        
		
		
	},
	
	submitScreen: function() {
	

		var eventList = new EventList();
		var _this = this;
		
		eventList.fetch({
			success: function(data) {
				console.log("fetched events: ");
				console.log(data);
				_this.submitView = new SubmitView({collection: eventList});
				$('#grid').html(_this.submitView.render().el);
				_this.submitView.addAll();
				_this.submitView.afterRender();
				}
		});
		
 	
 		
	},
	
	editScreen: function() {
	

		var eventList = new EventList();
		var _this = this;
		
		eventList.fetch({
			success: function(data) {
				console.log("fetched events: ");
				console.log(data);
				_this.editView = new EditView({collection: eventList});
				$('#grid').html(_this.editView.render().el);
				_this.editView.addAll();
				_this.editView.afterRender();
				}
		});
		
 	
 		
	},
	

	
	viewScreen: function() {
	
		var eventList = new EventList();
		var _this = this;

		eventList.fetch({
		success: function(data) {
			console.log("fetched events: ");
			console.log(data);
			_this.calendar = new CalendarView({collection: eventList});
			$('#grid').html(_this.calendar.render().el);
			_this.calendar.addAll();
			_this.calendar.afterRender();
			}
		});
		

		
 		
 		
 		
	}

});

var app = new AppRouter();

$(function() {
	Backbone.history.start();
});