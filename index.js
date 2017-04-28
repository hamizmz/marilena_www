var MAX_FONT_SIZE = 192;
var FONT_HEIGHT_FACTOR = 3;
var NAME = ["Marilena", "Vlachopoulou"];

var _flags = {
	reflow: true
};

function get_font_size(width) {
	return Math.round(Math.min(MAX_FONT_SIZE, width / 10));
};

function init() {
	loop({
		elements: {
			header: document.getElementById("header"),
			composition: document.getElementById("title"),
			mask: document.getElementById("overlay"),
			background: document.getElementById("bg"),
		}
	});
};

function flow(state) {
	state.width = state.elements.header.clientWidth;
	state.font_size = get_font_size(state.width);
	state.height = state.font_size * FONT_HEIGHT_FACTOR;
	
	[
		state.elements.composition,
		state.elements.mask
		
	].forEach((el) => {
		
		el.width = state.width,
		el.height = state.height
		
	});
	
	return state;
};

function flag_reflow() {
	_flags.reflow = true;
};

function draw_mask(state) {
	var mask = state.elements.mask.getContext("2d");
	
	mask.font = state.font_size + "px Fatface";
	mask.fillStyle = "#5aaaad";
	mask.fillText("Marilena", 0, state.font_size);
	mask.fillText("Vlachopoulou", 0, state.font_size * 2);
	
	return mask.getImageData(0, 0, state.width, state.height);
};

function draw_composition(state) {
	var title = state.elements.composition.getContext("2d");
	title.putImageData(state.mask_data, 0, 0);
	title.globalCompositeOperation = "source-atop";
	
	// Here, position and dimensions will be determined by the kenburns effect.
	var image = state.elements.background;
	title.drawImage(
		state.elements.background,
		0, 0,
		state.width,
		(state.width / image.width) * image.height
	);
};

function loop(state) {
	if (_flags.reflow) {
		_flags.reflow = false;
		
		state = flow(state);
		state.mask_data = draw_mask(state);
	}
	
	// Place ken_burns data here...
	//
	draw_composition(state);
	
	requestAnimationFrame(function() {
		loop(state);
	});
};

window.addEventListener("load", init, false);
window.addEventListener("resize", flag_reflow, false);