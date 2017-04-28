var MAX_FONT_SIZE = 192;
var FONT_HEIGHT_FACTOR = 2.5;
var FONT_SCALE_FACTOR = 8;
var KEN_BURNS_SCALE = 1.5;
var KEN_BURNS_SPEED = 0.2;
var NAME = ["Marilena", "Vlachopoulou"];

var _flags = {
	reflow: true
};

function get_font_size(width) {
	return Math.round(Math.min(MAX_FONT_SIZE, width / 8));
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

function vector(x, y) {
	return {
		x: x,
		y: y
	};
};

function subtract(v2, v1) {
	return {
		x: v2.x - v1.x,
		y: v2.y - v1.y
	};
};

function add(v1, v2) {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y
	};
};

function scale(v, scale) {
	return {
		x: v.x * scale,
		y: v.y * scale
	};
};

function length_sq(v) {
	return v.x * v.x + v.y * v.y
};

function unit(v) {
	var x2 = v.x * v.x;
	var y2 = v.y * v.y;
	var l2 = x2 + y2;
	return {
		x: x2 / l2,
		y: y2 / l2
	};
};

function compare(v1, v2) {
	return v1.x === v2.x && v1.y === v2.y;
};

function within_range(v1, v2, range) {
	return v1.x > v2.x - range && v1.x < v2.x + range ||
		v1.y > v2.y - range && v1.y < v2.y + range;
};

function kenburns(state) {
	state.current = add(state.current, state.speed);
	return state;
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
	
	
	var image = state.elements.background;
	var state_dimensions = vector(
		state.width,
		(state.width / image.width) * image.height
	);
	var kb_dimensions = scale(state_dimensions, KEN_BURNS_SCALE);
	state_dimensions.y = state.height;
	
	var target = scale(subtract(kb_dimensions, state_dimensions), -1);
	
	state.kenburns = {
		current: vector(0, 0),
		target: target,
		speed: scale(unit(target), -KEN_BURNS_SPEED),
		box: kb_dimensions
	};
	
	return state;
};

function flag_reflow() {
	_flags.reflow = true;
};

function draw_mask(state) {
	var mask = state.elements.mask.getContext("2d");
	
	mask.font = state.font_size + "px Fatface";
	mask.fillStyle = "#5aaaad";
	mask.fillText(NAME[0], 0, state.font_size);
	mask.fillText(NAME[1], 0, state.font_size * 2);
	
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
		state.kenburns.current.x,
		state.kenburns.current.y,
		state.kenburns.box.x,
		state.kenburns.box.y
	);
};

function loop(state) {
	if (_flags.reflow) {
		_flags.reflow = false;
		
		state = flow(state);
		state.mask_data = draw_mask(state);
	}
	
	if (!within_range(state.kenburns.current, state.kenburns.target, 1))
		state.kenburns = kenburns(state.kenburns);
	
	draw_composition(state);
	
	requestAnimationFrame(function() {
		loop(state);
	});
};

window.addEventListener("load", init, false);
window.addEventListener("resize", flag_reflow, false);