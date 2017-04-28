function init() {
	// Setup all Canvas elements
};

function flow() {
	// Resize all the elements and stuffs.
	// Setup our Kenburns effect
	draw();
};

function draw() {
	// Draw the current everything to be masked based on all cached image
	// data.
};

function main() {
	window.addEventListener("resize", flow, false);
	init();
	flow();
};

window.addEventListener("load", main, false);