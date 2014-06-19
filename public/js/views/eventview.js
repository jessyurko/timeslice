var EventView = Backbone.View.extend({

    //... is a list tag.

    // Cache the template function for a single item.
    template: Handlebars.compile(
    	'<div class="event-edit">'+
    	'<span class="event-title" data-param="title">{{title}}</span><div class="edit"><input type="text" value="" class="input" id="edit-title" data-param="title"/></div>'+
    	'<br /><span class="event-date"></span><br />'+
    	'<span class="event-time"></span><br />'+
    	'{{#if imgurl}}<img src= {{imgurl}} width="100"><br />{{/if}}'+
    	'<input type="checkbox" class="event-destroy">'+
    	'</div>'
    ),

    // The DOM events specific to an item.
    events: {
      "click .check"              : "toggleDone",
      "dblclick span.event-text"    : "edit",
      "blur .event-input"	:	"setText",
      "click .event-destroy"   : "clear",
      "keypress .todo-input"      : "updateOnEnter"
    },

    // The TodoView listens for changes to its model, re-rendering.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    // Re-render the contents of the todo item.
    render: function() {
    	console.log(this.model);
      $(this.el).html(this.template(this.model.attributes));
      console.log(this);
     // this.setText();
     
     var date = new Date(this.model.attributes.date);
     var time = new Date(Date.parse(this.model.attributes.time));

     $(this.el).find(".event-date").html(date.toString("m"));
     $(this.el).find(".event-time").html(time.toString("HH:mm"));

      return this;
    },

    // To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the todo item.
    setText: function(e) {
      var param = $(e.target).attr("data-param");
      $("#event-"+param).html($(e.target).val());
      $("#event-"+param).show();
      $(e.target).hide();
      console.log(this.model);
      this.model.attributes.title = $(e.target).val();
      this.model.save({title:  $(e.target).val()});
      
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function(e) {
      $(this.el).addClass("editing");
      var param = $(e.target).attr("data-param");
      var input = $(".input-"+param);
      $(input).val($(".event-"+param).html());
      $(e.target).hide();
      $(input).focus();
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
    	console.log(this);
      this.model.destroy();
    }

  });