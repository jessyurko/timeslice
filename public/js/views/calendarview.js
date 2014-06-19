var CalendarView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    
  calTemplate: Handlebars.compile(
        
         ' <div id="events">'+
         '   <div id="event-list"></div>'+
         ' </div>'

    
    ),
    
    initialize: function() {
     	this.collection.bind('sync', this.addAll());
     //	this.collection.bind('add', this.addAll());
     //	this.collection.bind('reset', this.addAll());
    },
    
    events: {
    
    
    },

   render: function() {
   		var _this = this;
      $(this.el).html(_this.calTemplate());
    	//$("#event-list").isotope({itemSelector: '.item'});
	
	
		$("#event-list").imagesLoaded(function() {
			$("#event-list").isotope('layout');
		});
      return this;
    },
    
    afterRender: function() {
		this.container = $('#event-list');
		// init
		this.container.isotope({
		  // options
		  itemSelector: '.item',
		  layoutMode: 'fitRows'
		});
    },
    
    addOne: function(todo) {
      var item = new ItemView({model: todo});
      console.log(item);
      var elem = item.render();
      var newdiv = $(elem.el).children()[0];
      this.$("#event-list").append($(elem.el).children()[0]);
    },
    

    // Add all items in the **Todos** collection at once.
    addAll: function() {
    	console.log(this.collection.models.length);
    	var _this = this;
      var oldDate = "";
      this.collection.each(function(o) {
      	console.log(o);
        _this.addOne(o);
     // 	var newDate = new Date(o.get("date")).toString("MMMM d");
    //  	var newTime = new Date(o.get("date")).toString("HH:mm");
     /* 	if(newDate != oldDate) {
      		this.$("#todo-list li").last().append("<div class='date-text'><b>"+newDate+"</div>");
      		oldDate = newDate;
      	} // else this.$("#todo-list li").last().append("<div class='date-text'>"+newTime+"</div>");
      	
      	*/
      	
      });
      console.log(this.container);
    },
    
    

   

  });