var EditView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    
  submitTemplate: Handlebars.compile(
    		'<div id="create-event">'+
            '<input id="new-title" placeholder="Text" type="text" /><br />'+
          '<input id="new-date" placeholder="Date & Time" type="text" /><br />'+
          '  <input id="new-link" placeholder="Image Link" type="text" /><br />'+
          '  <button id="submit-item">Submit</button>'+
         ' </div>'+
          
         ' <hr>'+

         ' <div id="events" >'+
         '   <div id="event-list"></div>'+
         ' </div>'

    
    ),
    
  mobileTemplate: Handlebars.compile(

    		'<div id="create-event">'+
            '<input id="new-title" placeholder="Text" type="text" /><br />'+
            
            
            
        '<div class="form-row">'+
	   '<select name="month-select" id="month-select" class="date-input form-control">'+
		'  <option value="standard">January</option>'+
	   '</select>'+	
	     
	   '<select name="day-select" id="day-select" class="date-input form-control">'+
		'  <option value="standard">Standard: 7 day</option>'+
	   '</select>'+	 

	   '<select name="hour-select" id="hour-select" class="date-input form-control">'+
		'  <option value="standard">Standard: 7 day</option>'+
	   '</select>'+	   

	   '<select name="minute-select" id="minute-select" class="date-input form-control">'+
		'  <option value="standard">Standard: 7 day</option>'+
	   '</select>'+	      
	   
	'</div>'+
	
          '  <input id="new-link" placeholder="Image Link" type="text" /><br />'+
          '  <button id="submit-item">Submit</button>'+
         ' </div>'+
          
         ' <hr>'+

         ' <div id="events">'+
         '   <div id="event-list"></div>'+
         ' </div>'


	),

  ltkTemplate: Handlebars.compile(
	'<div id="create-event" class="form-row">'+
	'<div id="image-upload">'+
	'<span id="loading" style="display:none">loading . . .</span>'+
		'<form enctype="multipart/form-data" method="post"  id="img-form">'+
			'<textarea class="form-control form-text" rows="3" id="new-text" placeholder="Ideas, observations, questions, #library #machines"/><br />'+

			'<button id="upload-proxy" type="button" class="action-buttons btn btn-default submit-form-button">+ Photo</button>'+
			'<input type="file" id="files" name="files" style="display:none" multiple /><br />'+
			'<output id="list" name="list"></output>'+
			'<div class="upload-controls"><button type="button" class="btn btn-danger btn-upload hidden" id="clear-upload" name="clear">Clear</button>'+
		'</div><button type="button" class="btn btn-default submit-form-button" id="submit-upload" name="submit">Submit</button></form>'+
	'</div></div>'+
          
       ' <hr>'+

         ' <div id="events" >'+
         '   <div id="event-list"></div>'+
         ' </div>'   

	

    
    ),
    
    initialize: function() {
    	console.log(this.collection);
     	this.collection.bind('all', this.addAll());
  		
    },
    
    events: {
      "click #submit-item":  "createItem",
      "click .todo-clear a": "clearCompleted",
      "change #new-date" : "updateDateTime",
	  "change #files" : "handleFileSelect",
	  "click #submit-upload" : "uploadItem",
	  "click #clear-upload" : "clearFiles",

    },

   render: function() {
   		var _this = this;
   		//if(jQuery.browser.mobile) {}
		//$(this.el).html(_this.submitTemplate());
 		$(this.el).html(_this.ltkTemplate());


      return this;
    },
    
    uploadItem: function() {
 		var _this = this;
		var date = new Date();
		var title = $("#new-text").val();
		$("#loading").toggle();
		
		var formData = new FormData($('#img-form')[0]);
	
	if($("#files")[0].files.length > 0) {
		  xhr = new XMLHttpRequest();
		  var fd = new FormData();
		  var imgdata = $(".thumb").attr("src");
		  imgdata = imgdata.replace(/^data:image\/(png|jpeg);base64,/, "");
		  fd.append('image', imgdata);
		 xhr.open("POST", "https://api.imgur.com/3/image.json");
		  xhr.onload = function () {
		   // callback && callback(JSON.parse(xhr.response));
			var data = JSON.parse(xhr.response);
			var link = data.data.link;
			console.log(link);
			var url = link;
			_this.collection.create({title: title, date: date, imgurl: url}); 
			
			_this.clearFiles();
			$("#new-text").val("");
			$("#loading").toggle();

			       
		  }
		  xhr.setRequestHeader('Authorization', 'Client-ID a383a2ab02028c4');
		  xhr.send(fd); 
		  console.log(xhr);
		} else {
			var url = "";
			_this.collection.create({title: title, date: date, imgurl: url});        
			$("#loading").toggle();
		}
		
    },
    
	handleFileSelect: function(evt) {
		var files = evt.target.files; // FileList object
		
		
		$(".btn-upload").removeClass("hidden");
		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {
		
			var size = $("#files")[0].files[0].size;
			if(size > 15000000) {
				alert("File must be less than 15MB.");
				this.clearFiles();
			} else {

			  // Only process image files.
			  if (!f.type.match('image.*')) {
				continue;
			  }

			  var reader = new FileReader();

		    // Closure to capture the file information.
			reader.onload = (function(theFile) {
				return function(e) {
				// Render thumbnail.
				var span = document.createElement('span');
				span.innerHTML = ['<img class="thumb" width="100" src="', e.target.result,
								'" title="', escape(theFile.name), '"/>'].join('');
				document.getElementById('list').insertBefore(span, null);
				};
			})(f);

			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
			

			}
		}
	},
    
    afterRender: function() {

    /* $('#new-date').datetimepicker({
		controlType: 'select',
		timeFormat: 'hh:mm tt'
		});  */
	

    $("#upload-proxy").click(function () {
    		$("#files").trigger('click');
		});
	  
    },
    
    
    updateDateTime: function() {
      var temp = $("#new-date").val();
      temp = temp.split(" ");
      this.date = temp[0];
      this.time = temp[1] + temp[2];    
    },
    

	createItem: function(e) {
      var title = $("#new-title").val();
      var url = $("#new-link").val();

      
      $(".item-input").val("");
      
      var date = this.parseDate(this.date);
      var time = this.parseDate(this.time);
      time = time.toString("HH:mm");
      console.log(time);
      
      this.collection.create({title: title, date: date, imgurl: url, time:time});
    },
    
    parseDate: function(date) {
    	var initdate = Date.parse(date);
    	var newDate = new Date(initdate);
    	return newDate;
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(EventList.done(), function(todo){ todo.destroy(); });
      return false;
    },
    
    
    addOne: function(item) {
    	console.log(item);
      var view = new EventView({model: item});
      console.log(view.render().el);
      this.$("#event-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
    	console.log(EventList.models);
      this.collection.each(this.addOne);
    },
    
	
	clearFiles: function() {
		$("#list").html("");
		$("#files").replaceWith($("#files").clone());
		$(".btn-upload").addClass("hidden");
	
	},    


  });