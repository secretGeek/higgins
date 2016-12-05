var slides;
var slide;
slide = 0;

$(document).ready( 
    function() {
		slides = $('.slide');
		var hash = window.location.hash || "#0";
		var num = parseInt(hash.replace('#',''));
		show(num);
		 $('.slide').click(function () {
			var deltaX = event.offsetX / document.width;
			move(deltaX < 0.3 ? -1 : 1);
			//if (deltaX <= -2) move(-1);
			//if (deltaX >= 2)  move( 1);
			//console.info("%s / %s == %s", event.offsetX, document.width, deltaX);
		});
});
	

function hide(num) {
  slides[num].style.display = "none";
}

var notesVisible = false;

function showNotes() {
 notesVisible = !notesVisible;
 var notes = $(slides[slide]).children('.notes').html();
 $('#noteDetail').html(notes);
 if (notesVisible) {
   $('#noteDetail').show();
 } else {
   $('#noteDetail').hide();
 }
}

function show(num) {
  notesVisible = false
  $('#noteDetail').hide();
  var notes;
  slide = num;
  slides[num].style.display = "block";
  $('#num').html("<a href='#" + num + "'>" + num + "</a>");

  var notey = $(slides[slide]).children('.notes');

  if (notey.length > 0) {
    
    notes = notey.html();
    
    if (notey.hasClass('md')) {
      var md = notes.htmlDecode();
      var reader = new commonmark.Parser();
      var writer = new commonmark.HtmlRenderer();
      var parsed = reader.parse(md);
      notes = writer.render(parsed);
      notey.removeClass('md');
      $(slides[slide]).children('.notes').html(notes);
    }
      
    $('#notes').show();
  } else {
    notes = null;
    $('#notes').hide();
  }

  if ($(slides[num]).hasClass('J')) {
    $('#speaker').html('J');
  } else if ($(slides[num]).hasClass('L')) {
      $('#speaker').html('L');
  } else {
      $('#speaker').html('');
  }
  
  if ($(slides[num]).hasClass('md')) {
    $(slides[num]).children('.notes').remove();
    var slideContent = ($(slides[num]).html()).htmlDecode();
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    var parsed = reader.parse(slideContent);
    $(slides[num]).removeClass('md');
    var result = writer.render(parsed);
    $(slides[num]).html(result);
    if (notes !== null) {
      $(slides[num]).append("<span class='notes'>" + notes + "</span>");
    }
  }
}

function move(n) {
  hide(slide);
  slide = slide + n;
  if (slide > slides.length - 1) {
    slide = 0;
  }
  if (slide < 0) {
    //time to wrappy round back to the start.
    slide = slides.length - 1;
  }
  show(slide);
}

function next() {
  move(1);
}
function previous() {
  move(-1);
}

document.onkeydown = function(e) {
  var keyvent = e || window.event;
  var keyPressed = keyvent.which || keyvent.keyCode;
  switch (keyPressed) {
    case 32 :  // [ctrl|shift] space
      return move(keyvent.ctrlKey || event.shiftKey ? -1 : 1);
    case 37 : 
	case 39 :  // left and right arrows
      if (!keyvent.metaKey && !keyvent.altKey) 
        return move(keyPressed === 37 ? -1 : 1);
	}
};

if (typeof String.prototype.htmlDecode !== "function") {
    String.prototype.htmlDecode = function () {
        var a = document.createElement('a'); a.innerHTML = this.toString();
        return a.textContent;
    };
}
