const carouselContainer = document.getElementById("carousel-container");
const carouselBackgrounds = carouselContainer.getElementsByClassName("background");
const carouselButtons = carouselContainer.querySelectorAll("button");
const carouselDots = carouselContainer.getElementsByClassName("dot");
const carouselPrevButton = carouselButtons[0];
const carouselNextButton = carouselButtons[1];
let currentCarouselPosition = 0;
let currentBackground = carouselBackgrounds[0];
let selectedCarouselDot = carouselDots[0];
let isUpdatingCarousel = false; 
let isModifyingCarousel = false;

function removeCarouselDotClasses(dot) {
	dot.firstChild.setAttribute("class", "");
}
function addCarouselDotClasses(dot, dotClasses) {
	for (const currentDotClassValue of dotClasses) {
		dot.firstChild.classList.add(currentDotClassValue);
	}
}
function updateCarouselDotClasses(dot, dotClasses) {
	removeCarouselDotClasses(dot);
	addCarouselDotClasses(dot, dotClasses);
}

function sleep(ms=0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateUpdatingProcess() {
	isUpdatingCarousel = true;
	await sleep(2000);
	isUpdatingCarousel = false;
}

function updateCarouselPosition() {
	carouselContainer.setAttribute("backgroundid", currentCarouselPosition.toString());

	currentBackground.setAttribute("isvisible", "false");
	currentBackground = carouselBackgrounds[currentCarouselPosition];
	currentBackground.setAttribute("isvisible", "true");

	updateCarouselDotClasses(selectedCarouselDot, ["far", "fa-circle"]);
	selectedCarouselDot = carouselDots[currentCarouselPosition];
	updateCarouselDotClasses(selectedCarouselDot, ["fas", "fa-circle"]);

	resetCarouselAutoPlay();
	updateUpdatingProcess();
}

function resetCarouselAutoPlay() {
	clearInterval(carouselAutoPlay);
	carouselAutoPlay = setInterval(
		() => {
		currentCarouselPosition++;
		if (currentCarouselPosition > 2) currentCarouselPosition = 0;
		updateCarouselPosition();
		}, 
		5000
	);
}

async function modifyCarouselPosition(action) {
	if (!(isModifyingCarousel)) {
		isModifyingCarousel = true;
		if (isUpdatingCarousel) {
			await sleep(1000);
		}
		if (action == "increase") {
			currentCarouselPosition++;
			if (currentCarouselPosition > 2) currentCarouselPosition = 0;
		} else if (action == "decrease") {
			currentCarouselPosition--;
			if (currentCarouselPosition < 0) currentCarouselPosition = 2;
		}
		updateCarouselPosition();
		isModifyingCarousel = false;
	}
}

carouselPrevButton.addEventListener("click", () => {
	modifyCarouselPosition("decrease");
});

carouselNextButton.addEventListener("click", () => {
	modifyCarouselPosition("increase");
});

for (let i=0; i < carouselDots.length; i++) {
	const currentCarouselDot = carouselDots[i];
	currentCarouselDot.addEventListener("click", () => {
		if (currentCarouselPosition !== i) {
			currentCarouselPosition = i;
			updateCarouselPosition();
		}
	});
}

let carouselAutoPlay = setInterval(
	() => modifyCarouselPosition("increase"), 7000
);

document.querySelector("footer").firstChild.
textContent = `Nahuel Nicolas Barbieri \u00A9 ${new Date().getFullYear()}, All RIghts Reserved`;