var ItemView = Backbone.View.extend({

      //... is a list tag.

    // Cache the template function for a single item.
    template: Handlebars.compile(
    	'<div class = "todo item"><div class="display"><div class="background"><img class= "todo-img"><div class="item-text"></div></div></div></div>'
    
    ),

    // The DOM events specific to an item.
    events: {
      "click .check"              : "toggleDone",
      "click span.todo-destroy"   : "clear",
      "keypress .todo-input"      : "updateOnEnter",
      "click .todo-img"			  : "resizeImg",
     
    },

    // The TodoView listens for changes to its model, re-rendering.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    // Re-render the contents of the todo item.
    render: function() {
      var _this = this;
      console.log(_this.template());
      console.log(this.el);
      $(this.el).html(_this.template());
      this.setText();
      
      imagesLoaded(".todo-img", function() {
      	$.each($(".todo-img"), function(i, val) {
      		if($(val).width() >= $(val).height()) {
      			$(val).css("width", 300);
      		}
      		$(val).next().css("width", $(val).css("width"));
      	});		
      });
      
      
      return this;
    },
    
    resizeImg: function(e) {
    	var target = e.target;
    	if(!$(target).hasClass("large")) {
    		var w = Math.floor($(target).width());
    		console.log(w);
    		$(target).attr("data-w", w);
    		$(target).css("width", 600);
    		$(target).addClass("large");
    	
    	} else {
    		console.log("other");
    		$(target).removeClass("large");
    		var w = $(target).attr("data-w");
    		$(target).css("width", w);
    	}
    },
    
    dateHover: function(e) {
    	$(e.target).toggleClass("border");
    },

    // To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the todo item.
    setText: function() {
      var text = this.model.get('title');
      var link = this.model.get('imgurl');
     // var date = this.model.get('date');
      //var time = this.model.get('time');
     
      console.log(this);
      this.$('.todo-text').text(text);
     // this.$('.todo-date').text(date);
      this.$('.todo-link').text(link);
      
      if(link != "") {
		  this.$('.todo-img').attr('src', link);
		  this.$('.todo-img').css('width', '200');
		  this.$(".item-text").text(text);

		  console.log(this.$('.todo-img').css('height'));
      } else {
    
      	this.$(".display").append('<span class="just-text">'+text+'</span>');
      	this.$(".background").addClass("just-text-bg");
       	this.$(".background").removeClass("background");
     	


      }
      

      this.input = this.$('.todo-input');
      this.input.bind('blur', _.bind(this.close, this)).val(text);
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },



    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      this.model.save({text: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove this view from the DOM.
    remove: function() {
      $(this.el).remove();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }



  });