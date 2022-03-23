import slidesList from './dataSlidesList.js';

const slide = document.querySelector('.slide');
const paginationList = document.querySelector('.slider__pagination');
const buttonsNavigation = document.querySelector('.slider__button');
const numberSlides = slidesList.length;

const time = 3000;
let active = 0;
let isDragging = false;
let startPosition, resultPosition;
let indexInterval;

const urlImg = 'images/';
const urlLink = '';

const createTemplateClone = function (template, element) {
	element.appendChild(template.content.cloneNode(true));
};
const disableContextMenu = function (element) {
	element.oncontextmenu = function (event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};
};

const displayPagination = function () {
	const templateButtonElement = document.querySelector('#slider-pagination-item');

	for (let index = 0; index < numberSlides; index++) {
		createTemplateClone(templateButtonElement, paginationList);

		createAtributesPaginationButtons(index);
	}
};

const createAtributesPaginationButtons = function (index) {
	const paginationButtons = document.querySelectorAll('.slider__pagination-btn');
	paginationButtons[index].setAttribute('data-number', `${index}`);
	paginationButtons[0].classList.add('slider__pagination-btn--active');
};

const changeSlide = function () {
	const picture = [...slide.children][0].children;
	const link = [...slide.children][1];

	picture.item(0).srcset = `${urlImg}${slidesList[active].srcset}`;
	picture.item(1).srcset = `${urlImg}${slidesList[active].img}`;
	picture.item(2).src = `${urlImg}${slidesList[active].img}`;
	picture.item(2).alt = `${slidesList[active].alt}`;
	link.href = `${urlLink}${slidesList[active].link}`;

	changeButtonPagination();
};

const nextChangeSlide = function () {
	active++;
	if (active === slidesList.length) {
		active = 0;
	}
	changeSlide();
};

const changeSlidePagination = function (e) {
	e.stopPropagation();

	if (e.target.tagName === 'A') {
		active = e.target.dataset.number;
		clearInterval(indexInterval);
		changeSlide();
		indexInterval = setInterval(nextChangeSlide, time);

		changeButtonPagination();
	}
};

const changeButtonPagination = function () {
	const arrayPaginationButtons = [...paginationList.children];
	const activePaginationButton = arrayPaginationButtons.findIndex(paginationButton =>
		paginationButton.classList.contains('slider__pagination-btn--active'),
	);
	arrayPaginationButtons[activePaginationButton].classList.remove('slider__pagination-btn--active');
	arrayPaginationButtons[active].classList.add('slider__pagination-btn--active');
};

const getPositionX = function (event) {
	return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
};

const touchStart = function () {
	isDragging = true;
	startPosition = getPositionX(event);
};

const touchEnd = function () {
	isDragging = false;
	manualChangeSlide(resultPosition > 100, resultPosition < -100);
};
const touchMove = function (event) {
	if (isDragging) {
		const currentPosition = getPositionX(event);
		resultPosition = currentPosition - startPosition;
	}
};
const manualChangeSlide = function (prev, next) {
	if (prev || next) {
		clearInterval(indexInterval);
		prev ? active-- : active++;
		if (active == slidesList.length) {
			active = 0;
		} else if (active < 0) {
			active = slidesList.length - 1;
		}
		changeSlide();

		indexInterval = setInterval(nextChangeSlide, time);
	}
};

const initSlider = function () {
	indexInterval = setInterval(nextChangeSlide, time);
	disableContextMenu(slide);
	displayPagination();
	changeSlide();

	paginationList.addEventListener('click', changeSlidePagination);
	slide.addEventListener('dragstart', e => e.preventDefault());

	slide.addEventListener('touchstart', touchStart);
	slide.addEventListener('touchend', touchEnd);
	slide.addEventListener('touchmove', touchMove);

	slide.addEventListener('mousedown', touchStart);
	slide.addEventListener('mouseup', touchEnd);
	slide.addEventListener('mousemove', touchMove);
	buttonsNavigation.addEventListener('click', e => {
		manualChangeSlide(e.target.className === 'slider__button-prev', e.target.className === 'slider__button-next');
	});
	window.addEventListener("keydown", (e) => {
		manualChangeSlide(e.key === 'ArrowLeft', e.key === 'ArrowRight');
	})
};

export default initSlider;
