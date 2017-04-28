var _header = document.getElementById("header");
var _image = document.getElementById("bg");

var MAX_FONT_SIZE = 160;

function render_translate(x, y) {
	return "translate(" + x + "px, " + y + "px)";
};

function render_scale(f) {
	return "scale(" + f + ", " + f + ")";
};

function render_px(s) {
	return s + "px";
};

function render_px(w) {
	return w + "px";
};

function get_info(el) {
	var box = el.getBoundingClientRect();
	return {
		x: box.left,
		y: box.top,
		width: box.right - box.left,
		height: box.bottom - box.top
	};
};

function get_font_size(width) {
	return Math.min(MAX_FONT_SIZE, width / 10);
};

function get_rand(min, max) {
	return Math.random() * (max - min) + min;
};

function get_rand_int(min, max) {
	return Math.round(get_rand(min, max));
};

function get_final(pos, space) {
	return (pos + space > -pos) ?
		-get_rand_int(-pos + (space + pos) / 3, space) :
		-get_rand_int(0, -0.66 * pos);
};

function ken_burns(image, box) {
	image.style.transform = null;
	
	var width = box.width * 1.25;
	var height = box.height * 1.25;
	
	var x_space = width - box.width;
	var y_space = height - box.height;
	
	var x = -get_rand_int(0, x_space);
	var y = -get_rand_int(0, y_space);
	
	var final_x = get_final(x, x_space);
	var final_y = get_final(y, y_space);
	
	// image.style.transform = render_translate(x, y);
	image.style.width = render_px(width);
	setTimeout(function() {
		// image.style.transform = render_translate(final_x, final_y);
	}, 500);
};

function draw_svg(o, font_size) {
	init_text(font_size, font_size);
	_images[0].style.display = "none";
	return;
	var header_info = get_info(_header);
	o.width = header_info.width;
	o.height = header_info.height;
	
	if (navigator.userAgent.indexOf("WebKit") > -1) {
		o.x = header_info.x;
		o.y = header_info.y;
	}
	
	ken_burns(_images[0], o);
	init_svg(o, font_size, font_size);
};

function draw() {
	var viewport_width = window.document.body.offsetWidth;
	var font_size = get_font_size(viewport_width);
	
	var o = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	
	_header.style.fontSize = render_px(font_size);
	// draw_svg(o, font_size);
	draw_canvas(o, font_size, _header.clientWidth);
};


function draw_canvas(o, font_size, viewport_width) {
	var _title = document.getElementById("title");
	var _name = document.createElement("canvas");
	var _overlay = document.getElementById("overlay");
	
	_overlay.width = _name.width = _title.width = viewport_width;
	_overlay.height = _name.height = _title.height = font_size * 3;
	
	var text = _name.getContext("2d");
	text.font = font_size + "px Fatface";
	text.fillStyle = "white";
	text.fillText("Marilena", 0, font_size);
	text.fillText("Vlachopoulou", 0, font_size * 2);
	
	
	var mask_data = text.getImageData(0, 0, _name.width, _name.height);
	var mask = _title.getContext("2d");
	mask.putImageData(mask_data, 0, 0);
	mask.globalCompositeOperation = 'source-atop';
	mask.drawImage(_image, 0, 0);
	
	text = _overlay.getContext("2d");
	text.font = font_size + "px Fatface";
	text.fillStyle = "#5aaaad";
	text.fillText("Marilena", 0, font_size);
	text.fillText("Vlachopoulou", 0, font_size * 2);
};


function init() {
	window.addEventListener("resize", draw, false);
	draw();
};

window.addEventListener("load", init, false);