'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  //this getBoundingClientRect() is a method which gives us the position of the element to the relative of the viewport i.e the display area i.e top border of display lower end of the display extreme left or right etc
  console.log(e.target.getBoundingClientRect());

  //we can also get the currentScrolling position 👇
  console.log('Current scroll(X/Y)', window.pageXOffset, pageYOffset);

  console.log(
    'height/width viewport', //viewport means display area
    document.documentElement.clientHeight, //its not counting the scroll bars its counting the viewport pixel area
    document.documentElement.clientWidth
  );
  //you will find this section repeated below
  //Scrolling -- so here scrollTo is a method to scroll to a specific position

  /*So this whole section is about manually calculating the specific position and then scrolling to that specific position
  //refer to lec 188👇
  // window.scrollTo(s1coords.left, s1coords.top);
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // for smooth scrolling we should add top ,left ,behaviour inside an object
  window.scrollTo({
    left:s1coords.left + window.pageXOffset,
    top:s1coords.top + window.pageYOffset,
    behavior:"smooth",
  })
*/
  //👇 this only works on modern browsers
  //more modern way👇 sectionName.scrollIntoview({behaviour})
  section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////////////////////////////////////////////
//Page Navigation

//so this method 👇 of attaching event listener to every element is fine but if there are more elements then this is not efficient so here event delegations come into play
// document.querySelectorAll(".nav__link").forEach(function (eachElement) {
//   eachElement.addEventListener('click',function (event) {
//     event.preventDefault();

//     //if we want we could have written id = this.href here 👇but it would have given the whole absolute path but we just only want the section
//     const id = this.getAttribute('href');
//     console.log(id);

//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// })
/*So in event delegation, we use the fact that events bubble up. And we do that by putting the eventListener on a common parent of all the elements that we are interested in.  */
/* And so in our example, it's this container that's around all of these links, and that we saw in the previous video. So remember, that is this element here. So we will put our event handler on this element(nav bar) here, and then when a user clicks one of the links, the event is generated, and bubbles up, just as we saw in the last video. And then we can basically catch that event in this common parent element, and handle it there. Because we also know where the event actually originated. Right? So we can figure that out by looking at the events.target property. So that's what event delegation is, and so let's now go ahead and implement it.*/

//for event delegation👇
//1.Add the event listener to common parent element
//2.Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //so if we see in  console then we will find that if the click has happened on one of the links then the class will be 'nav__link' but if the click has happened on the container navbar then it will show 'nav__links'
  //so we just need to avoid 'nav__links'

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); //e.target means the target element where the event has happened
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // we using closest method becoz what if the clicked button contains a child like span but we want only the button but as the button also contains span so we are using closest and here what happens if the button is only clicked then it will return the button but if the button's child span is clicked then also it returns the parent element that is button
  // console.log(clicked);
  //we are ignoring any clicks that happen to produce null
  //Guard clause -->in this case, when we have null which is a falsy value, then not falsy will become true and then the function will return and none of the code that's after it will be executed.
  if (!clicked) return;
  //the guard clause 👆 is a more modern  way
  //the traditional way would be👇
  // if (clicked) {
  //   clicked.classList.add('operations__tab--active');
  // }

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  //so here👆 as you can see the clicked.dataset.tab <- actually it means the data-tab which holds the value for each tabs i.e 1,2,3 or you can say that it is the html variable which we use in js to display the required content when the tab was clicked containing the value of variable'data-tab' that can be 1,2,3 iska matlab data-tab ek variable hai jiske madad se humlog content change kar sakte hai aur yahan data-tab ko select karne ke liye "data-tab" ko "dataset.tab" likna padega
});

//MENU FADE ANIMATION

const handleHover = function (e) {
  console.log(this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblingsOfNav = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    console.log(
      siblingsOfNav.forEach(el => {
        // if (el !== link) el.style.opacity = opacity;
        // as we have refactored this code and also we have used the bind method so the passed in 0.5 or 1 value i.e the opacity will be passed through "this" keyword here so instead of opacity👇 variable below we need to write "this" yaani ki this keyword whi contain ho tum bind()method ke andar likhoge i.e like for eg=> some.bind(something) and if we look into this keyword like console.log(this) for some.bind(something) then it will show something i.e this == something          if (el !== link) el.style.opacity = this;
        if (el !== link) el.style.opacity = this;
      })
    );
    // logo.style.opacity = opacity;refactored code so write this inplace of opacity
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);//so here what we could have done is write addEventListener('mouseover',handleHover(and then pass in the function as we did just now)) but there would be a problem of passing the event and opacity and if we would write this-> handleHover(e,0.5) then this will not work so instead we did was write or depict the function inside addEventlistener like this addEventListener(function(e){and then pass in handleHover(e,0.5) }) and now it will call handleHover as soon as addEventListener calls functions when mouseover happens
//   //👆 so there is opposite of mouseover and mouseenter and so opp of mouseover is mouseout and opp of mouseenter is mouseleave
//   // if (e.target.classList.contains('nav__link')) {
//   //   const link = e.target;

//   //   const siblingsOfNav = link.closest('.nav').querySelectorAll('.nav__link');
//   //   const logo = link.closest('.nav').querySelector('img');

//   //   console.log(siblingsOfNav.forEach(el => {
//   //         if (el !== link) el.style.opacity = 0.5;
//   //       }));
//   //   logo.style.opacity = 0.5;
//   // }refactord this code above👆

// });

//but instead of doing in line no handleHover(e,0.5) we could have also used bind method👇
nav.addEventListener('mouseover', handleHover.bind(0.5));

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky Navigation<-- this one is manual and is inefficient
// const initialCoords = section1.getBoundingClientRect();//it will show the current top value of the section

// window.addEventListener('scroll', function () {//scroll option is present in the window object when we attach addEventListener
//   console.log(window.scrollY);//it gives the position of top of the viewport to the top of the page
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');//here we are adding the sticky css class to navbar ,and the sticky class will maintain the navbar to all the section
//   else nav.classList.remove('sticky');
// })

//Sticky Navigation:Intersection Observor API<--this one is efficient
/*what actually is the intersection observer API, and why is it so helpful? Well, this API allows our code to basically observe changes to the way that a certain target element intersects another element, or the way it intersects the viewport. */
//to create an intersection observer API write const observer =  new IntersectionObserver() and pass in the params that will be one callback function and options so in options we will define the root of the viewport(matlab woh jagah i.e the target element which is intersecting but here we wrote null ) and then the threshold value matlab kitna percentage of the element dikhega toh callback function ko call karna so here we wrote threshold:0.1 i.e 10 percent so yaani like agar we wrote like this👇

// const  observorCallback = function (entries,observor){
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const observerOptions = {
//   root: null,
//   // threshold: 0.1 before we had set 10 percent now we will set multiple values👇
//   /*So you can use different threshold values, and maybe use different targets here, you can even use different roots, and so it would be a good idea to experiment a little bit more with this. Now what I'm gonna do here is to now specify an array, so to specify different thresholds, and one of them is gonna be zero, and the other one 0.2, so that's 20%. So 0% here means that basically our callback will trigger each time that the target element moves completely out of the view, and also as soon as it enters the view, okay? And so that's because the callback function will be called when the threshold is passed when moving into the view and when moving out of the view, and this is really important to remember here. */
//   threshold: [0,0.2]

// };

// const observer =  new IntersectionObserver(observorCallback,observerOptions );
// observer.observe(section1);
/*👆so yahan par kya ho rha ki jo humne define kiya that is observer (i.e intersection observer API ) usme humne pass kiya section 1 yaani ki jab bhi section 1 viewport yaani screen pe dikhega tabi intersection api kaam karega so ek tarah se intersection api ko observe karne bole hai yaani ki nazar rakhne bole hai section 1 par now look at options of observer i.e threshold which is 10 percent so yaani jab bhi section 1 ka 10 percent hissa(if you want to see the intersectionratio look at entry made by console.log) dikhega view port pe tabhi callback function call hoga
 */

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries; //here we are destructuring entries array and we are only interested in the first element so we wrote entry which depicts the first element of array

  if (!entry.isIntersecting)
    //you will find this isIntersecting element inside the object entry(the first element of array entries) which was produced when the header section moved out of the viewport
    nav.classList.add('sticky');
  //when header is not intersecting that is not visible then add sticky class
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //{also we got navHeight from getBoundingClientRect().hieght which we consolelogged it }lec 197 at 20:00 we specified this becoz when the header's root is just about to leave then the sticky class gets added that when only the 10 percent of the header is only intersecting so it does not overlap the next section which is coming after header
}); // when the header moves out of the viewport call stickyNav i.e callback
headerObserver.observe(header);

//Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return; // we add this guard clause becoz of the intersection observer object which was already getting created but the next section was not intersecting

  entry.target.classList.remove('section--hidden'); //inside entry it contains an object target which contains className so we will use this to add class to show the current section and not others
  observer.unobserve(entry.target); //becoz after the work is done we dont need the observer to continuously observe
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]'); //selecting img containing inside data-src attribute

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Replace the img attribute src with data-src img attribute
  entry.target.src = entry.target.dataset.src;

  //we are adding this event listener becoz at above 👆 you can see where the actual img is getting replaced with data-src img and this happens behind the scens in js where it loads the high resolution actual img but if we had removed the class 'lazy-img' ones which kept the img blurred(css class) then when there was slow network the actual image would be loading but the class would have already be removed which would have created this uneasy effect so to avoid we have used the event listener to listen to "load" of the image and when the loading gets finished then only remove the class of "lazy-img" 👇
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //we are loading the image before the observer has actually reached
});

//observe every image👇
imgTargets.forEach(img => imgObserver.observe(img));

//Slider
/*now just to finish,👇 let's actually put all of this code into a function as well. And so this way, we do not pollute the global namespace. So that's something we like to say. And we're gonna talk a little bit more about this also later in the course, though. But for now just know that it is a good practice */
const slider = function () {
  

  //if you see at the html file you will get the slider component and all the js is here👇
  const slides = document.querySelectorAll('.slide');
  const dotContainer = document.querySelector('.dots');
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';//this was written for just to make it easier to see if our code for slider was working or not
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  let currentSlide = 0;
  let maxSlide = slides.length;

  //functions
  const createDots = function () {
  
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',//i got 👇 this code from final wala file coz video mai bhi copy paste kiya tha
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    });
  };

  //function for active dots
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    //                 selecting data-slide attribute 👇 and then adding the active class
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }


  // slides.forEach((slide, index) => slide.style.transform = `translateX(${100*index}%)`);
  //in place of this👆 refactored is below👇                    0% 100% 200% 300% the slides position first will be 0 then second 100 and so on
  const goToSlide = function (currentSlide) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
    );
  };

  //next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    //slides.forEach((slide, index) => slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`);
    //well the mechanism here is that first pic that the index-currentSlide so here currentSlide will be 0 so first pic will be at the centre but after clicking the button currentSlide increases by 1 and index - 1 so that first slide will be at -100% and second one will be 0 and so on
    //this can also work on prev button or btn left where the algo is currentSide-- and the rest is same
    activateDot(currentSlide);
  };

  const prevSLide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);

  };
  //starting mai kaisa hona chahiye 👇 this is actually refactored one
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  }
  init()


  //Event handlers
  btnLeft.addEventListener('click', prevSLide);
  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSLide();
    e.key === 'ArrowRight' && nextSlide();
  });

  //for dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log('DOT');

      const { slide } = e.target.dataset;// we destructed dataset.slide into {slide} = dataset
      goToSlide(slide);
      activateDot(slide);

    }
  })
}
slider();
////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// console.log(document.documentElement);
// //documentElement <- actually we do have a special way of selecting  the entire document of well, of any webpage,  so of any document and that's document element, all right.  So just document here is not enough  to select the document element  because this is not the real DOM element, all right?  So for example if we want to apply CSS styles  to the entire page we always need  to select document element, okay?
// console.log(document.head); // we can easily select the head and body
// console.log(document.body);
// //we can also use querySelector
// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// //here👇 we dont need # to select as its used in  querySelector
// document.getElementById('section--1');
// //this 👇 getElementsByTag is a live collection that means it changes according to the change in DOM in the running website i.e if one button gets deleted after clicking then also the collection will automatically change
// const allButtons = document.getElementsByTagName('button');

// //but the same dosent happen with the (nodelist like allSections) becoz this variable here was created  by the time that this section still existed.

// // we can also select the elements with their classname
// console.log(document.getElementsByClassName('btn'));

// //Creating and Inserting elements
// //here 👇 we created an element
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

// //now we want to insert the message👇
// // header.prepend(message);//so here we just added the above message before header
// header.append(message); //so here we just added the above message after header
// //but if you see the message is added or inserted only once becoz this is a live message
// /*Now what we see here is that the element
// was actually only insert at once,
// now that's because this element here
// so message is now indeed a life element living in the DOM.
// And so therefore it cannot be
// at multiple places at the same time.
// It's just like a person that also cannot be
// at two places simultaneously, right?
// So what's happened here is that we first prepended
// the element and then we appended it.
// And what this appends did here
// was to basically move the element
// from being the first child to being the last child.
// All right, so basically it moved the element
// and didn't really insert it
// because it was already inserted here by prepend
// So what this means is that we can use
// the prepend and append methods not only to insert elements
// but also to move them.
// And again, that is because a DOM element is unique.
// So it can always only exist at one place at a time. */

// //if we want to insert multiple copies of same element then we have to copy the first element
// // header.append(message.cloneNode(true));

// header.before(message);
// // header.after(message);

// //Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();//it is recent
//     //so before it existed we did this👇
//     message.parentElement.removeChild(message);
//   });

// //also check the insertAdjacentHTML method used in bankist app

// //Styles
// //👇 these styles are actually set as inline styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height);
// console.log(message.style.backgroundColor);
// //from this👆 we can only get the styles which we have manually defined ourselves like the 'backgroundColor' and not the styles which are hidden that the color defined in the css style sheet

// //now we can still get the hidden styles ,all we need to do is to use getComputedStyle()
// console.log(getComputedStyle(message));
// //now we can getcomputed color👇 or anything
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// //we can use setProperty to set anything in styles
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// //👇 this shows the absolute source of img
// console.log(logo.src);
// /*👆So this works because on images they are supposed  to have the alt, and the source attributes on them  and so if we specify them in HTML,  then JavaScript will automatically create these properties  on the object, but if we add some other property  that is not a standard then JavaScript,  will not automatically create a property on the object. */

// //we can also alter or create anything in the attribute👇
// logo.alt = 'Beautiful minimalist logo';
// //Non standard attribute
// //so if try to achieve ""designer"" attribute that we just set👇
// console.log(logo.designer);
// //👆 it doesnt work becoz its the non standard property
// //but we can get the non standard property using getAttribute👇
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));

// //setAttribute
// logo.setAttribute('company', 'Bankist');

// //if we want to see the relative source of the image👇
// //absolute 👇
// console.log(logo.src);
// //relative👇
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //Data attributes
// //we can access the data-version-number in logo which was set as an attribute here by writing dataset.versionNumber 👇
// console.log(logo.dataset.versionNumber);

// //Classes
// logo.classList.add();
// logo.classList.remove();
// // logo.classList.toggle();
// // logo.classList.contains();

// console.log(logo.className);

// //Dont use👇
// // logo.className = 'jonas';

//implementing smooth scrolling 👇
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);
//   //this getBoundingClientRect() is a method which gives us the position of the element to the relative of the viewport i.e the display area i.e top border of display lower end of the display extreme left or right etc
//   console.log(e.target.getBoundingClientRect());

//   //we can also get the currentScrolling position 👇
//   console.log('Current scroll(X/Y)', window.pageXOffset, pageYOffset);

//   console.log(
//     'height/width viewport', //viewport means display area
//     document.documentElement.clientHeight, //its not counting the scroll bars its counting the viewport pixel area
//     document.documentElement.clientWidth
//   );

//   //Scrolling -- so here scrollTo is a method to scroll to a specific position

//   /*So this whole section is about manually calculating the specific position and then scrolling to that specific position
//   //refer to lec 188👇
//   // window.scrollTo(s1coords.left, s1coords.top);
//   // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

//   // for smooth scrolling we should add top ,left ,behaviour inside an object
//   window.scrollTo({
//     left:s1coords.left + window.pageXOffset,
//     top:s1coords.top + window.pageYOffset,
//     behavior:"smooth",
//   })
// */
//   //👇 this only works on modern browsers
//   //more modern way👇 sectionName.scrollIntoview({behaviour})
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// //MouseEnter event
// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('addEventListener :Great you are reading the heading!');

//   h1.removeEventListener('mouseenter', alertH1); //this makes it to only listen to the event once
//   //also we can remove the event listener any time i.e using setTimeout
// };
// //So, the mouseenter event here,is a little bit like the hover event in CSS.So, it fires whenever a mouse enters a certain element.
// h1.addEventListener('mouseenter', alertH1);

//instead of adding the eventListener we can use the on-event property directly on the element👇
//these on-event property old school👇
// h1.onmouseenter= function (e) {
//   alert('addEventListener :Great you are reading the heading!');
// }
//lec 189 time:5:15
/*Now, there are two ways why addEventListener is better.
And that is that first one(addEventListener) is that it allows us to add
multiple event listeners to the same event.
So, we could do this here again
and simply change the function here.
But if we did the same with this(on-event property) property,
then the second function(i.e another function with same on-event property) would basically
simply override the first one(previous same on-event property).
So, that's one advantage of addEventListener.
And the second one even more important
is that we can actually remove an event handler
in case we don't need it anymore. */

//now if we want to remove the event listener we can just write
// h1.removeEventListener('mouseenter', alertH1); this should be written in alertH1 function

//we can also use html event listener inside html like <h1 onclick ="alert('HTML alert')"></h1>

//Bubbling and capturing lec 190
/*Summary👇

Do I understand everything right?

1. User clicks target element. Capture phase starts.

2. Window captures event.

3. Event goes down, checking if any element on the way to the target has event handler and "making a note". (Not sure about this one).

4. Event reaches the target. Target phase starts.

5. Event listener in target catches the event and runs callback function attached to this target's event listener.

6. Now target phase is finished. Bubbling phase starts. Event goes (back) up.

7. Every event listener on its way is triggered and each runs its callback function until it reaches the window element (the main parent element in browser).

And all the event listeners have the element, which user clicked (the deepest one) as the target (e.taget) and element, to which we attached an event handler as the current target (e.currentTarget).

So all the elements on the way will have the same target - element which user clicked and different currentTargets. Also currentTarget is always === .this in event handler's callback function.*/

//rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// // console.log(randomColor(0, 255));

// //phase 1 i.e.BUBBLING PHASE👇
// //from 6:09  lec191 you will know about this bubbling
// if you wanna read whats in lec 6:09 -> /*you see that the container also got its own random background color. So based on what we learned in the last video, why do you think this is happening? Well, just as we learned before the event actually happens at the document root and from there it then travels down to the target element. And so in this case, that is this link. And then from there, it bubbles up. And bubbling up means that basically it's as if the event had also happened in all of the parent elements. And so that is the reason why this exact event is now also being handled by this event listener here that is on nav_links, okay? So again, it is as if the click event here on this link had also happened right here in this element, so in the nav_links element, all right? So both of these handlers here are now handling the same event which happened here on this link. And as we keep clicking of course, the same keeps happening. Now, what do you think happens when we click only outside here? So only in the nav_links? Well, let's see. So you see that the color on the link itself keeps unchanged and that's because this is the parent element. And so from here, the event only bubbles up to its parent elements. */

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   //we can also stop event propogation but in practice its not a good idea,also it can sometimes fix the problem in many complex problem
//   // e.stopPropagation();//here the parent element(i.e container,nav) will not change their color which means that the event never arrive at those elements, right. That's why they weren't handled there, and again, that is because we stopped the propagation right here.
// });
// /* the currentTarget is indeed,  the element on which the event handler is attached.  So, e.currentTarget  and here, e.currentTarget.  And so if we do this now,  then you will see that the currentTarget  is not the same.  Well, in the link it is of course,  because that's where the event happened  and it's also where the handler is attached to But then here it is, of course the nav_links. So, the container and here, the whole navigation element. And so you might have noticed that the currentTarget is exactly the same as the this keyword. So, the this keyword is also the one pointing to the element on which the EventListener is attached to   */

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
//   // console.log(e.currentTarget === this);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
//   // console.log(e.currentTarget === this);
// }, true);
/*document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
  // console.log(e.currentTarget === this);
}, true); */ //setting here true(third parameter) means we are listening to capture phase now and not the bubble phase so it will when the event comes down from document root to this element
//our event handler here is only listening the bubbling phase(event propogation from child to parent) but not the capturing phase(i.e event happens in the document then it travels down to the target i.e the child element where the event has happend)--> this is the default behaviour -->this is becoz capture phase is not useful for us but the bubbling phase can be useful for event delegation
/*However, if we really do want to catch events during the capturing phase, we can define a third parameter in the addEventlistener function. For example here, we can set the third parameter to true or false. And so let's set it to true. And so in this case where this used capture parameter is set to true, the event handler will no longer listen to bubbling events, but instead, to capturing events. */

//---------------DOM TRAVERSING---------------------------------------------------------------------------------------------
// const h_1 = document.querySelector('h1');
// //Going downwards:child i.e selecting child
// console.log(h_1.querySelectorAll(".highlight"));
// //it 👇will show all the nodes that are children of h1
// console.log(h_1.childNodes);
// //it 👇  will show only the children elements that are direct to h1
// console.log(h_1.children);
// h_1.firstElementChild.style.color = 'white';
// h_1.lastElementChild.style.color = 'orangered';

// //going upwards i.e selecting parents
// console.log(h_1.parentNode);//shows the parent node that is direct to h1
// console.log(h_1.parentElement);//shows the element that is direct to h1

// //but sometimes we want a parent element that is not direct Or in other words, we might need to find a parent element no matter how far away it is and the Dom tree.
// //and for that we have the closest method

// /*So let's say that on the page, we had multiple headers so multiple elements with a class of header, but for some reason we only wanted to find the one that is a parent element of h1. So of all h1 element here. And so for that, we can use closest. And so the closest method receives a query string just like querySelector and querySelectorAll. */
// h_1.closest('.header').style.background = 'var(--gradient-secondary)';//var means css variable and we are setting the color using css variable
// h_1.closest('h1').style.background = 'var(--gradient-secondary)';//it will the h1 that is the element itself

// //so here closest method is opposite of querySelector that is the querySelector finds children no matter how deep in the DOM tree and closest() finds parent closest to the element no matter how deep in the dom tree

// //Going sideways:selecting siblings
// //selecting ELement sibling👇
// console.log(h_1.previousElementSibling);
// console.log(h_1.nextElementSibling);

// //selecting sibling node👇
// console.log(h_1.previousSibling);
// console.log(h_1.nextSibling);

// //so to get all the sibling of h_1 we can move up the parent element and then read all the children from there👇
// console.log(h_1.parentElement.children);
// //now if we want to do something to all the siblings of h_1 we can do this👇
// [...h_1.parentElement.children].forEach(function (element) {
//   if (element !== h_1) element.style.transform = 'scale(0.5)';
// })

//---------------DOM TRAVERSING---------------------------------------------------------------------------------------------
/*Now to close off this section,
let's take a quick look at a couple of different events
that occur in the DOM during a webpage's life cycle.
And when we say lifecycle, we mean right from the moment
that the page is first accessed, until the user leaves it.
And let's do that right here at the end of this file.
Now, the first event that we need to talk about is called DOM content loaded.
And this event is fired by the document
as soon as the HTML is completely parsed, which means that the HTML has been downloaded
and been converted to the DOM tree.
Also, all scripts must be downloaded and executed before the DOM content loaded event can happen.
And of course we can listen to that event,
and since it happens on the document, we call the add event listener method on the document.
And then name of the event is, as I mentioned,
DOM content loaded.👇 */
document.addEventListener('DOMContentLoaded', function (e) {
  /*All right,now this event does actually not wait for images and other
external resources to load.Okay. So just HTML and JavaScript need to be loaded.
So let's now take a look at this event or basically justlog something to the console.
So HTML, parsed and DOM treebuilt, and we can also take a look at the event. 👇*/
  console.log('HTML parsed and DOM tree built', e);

}); 
/*So this here👆 means we can now execute code that should only be
executed after the DOM is available.
And in fact,we want all our code only to be executed after the DOM is ready.
Right? So does that mean that we should wrap our entire code into
an event listener like this? So with a function like this, well, actually, no,
we don't need to do that.
And that's because we have to script tag,
which is the one that imports or a JavaScript into the HTML,
right. At the end of the body. */

/*Now there are also other ways of loading the JavaScript file
with the script tag,but we're going to talk about that in the next lecture.
Now, right now, if you're coming to vanilla,
JavaScript from jQuery,then you're probably used to wrap all your code into a
document ready function, which in JavaScript,or actually in jQuery, it looks something like this.
And so this is equivalent to the DOM content loaded in
vanilla JavaScript.
Okay.
But again, no such thing is necessary in regular JavaScript.
Okay. */

//Load event listener👇
/*Anyway,next up there is also the load event and the load event is
fired by the window. As soon as not only the HTML is parsed,
but also all the images and external resources like CSSfiles are also loaded.
So basically when the complete page has finished loading is
when this event gets fired.
So as always, we can also then listen to that.👇*/
window.addEventListener('load', function (e) {
  // So load.,function,
  // and then here we can log.
  // Page fully loaded along with the event. 👇
  console.log('Page fully loaded', e);
});

//Unload event or before quitting👇
/*Now, finally,
the last event that I want to show you is the before unload
event, which also gets fired on window.
So window.add event listener.
And so that's before unload.
And this event here is created immediately before a user is
about to leave a page. So for example,
after clicking this close button here in the browser tab,
so we can basically use this event to ask users if they are
100% sure that they want to leave the page. */
// window.addEventListener('beforeunload', function (e) {
// // Now in some browsers to make this work,we need to call prevent default here. In Chrome
// // it's not necessary, but some browsers require it.👇
//   e.preventDefault();
// console.log(e);
//   /*And actually in order to display a leaving confirmation,we need to set the return value on the event to an empty
//  string. 👇*/
//   e.returnValue = '';
//   /*And so now we get this pop up(when we try to leave the page in the chrome browser) here, indeed, which asks us "if we want to leave the site". Now a long time ago, developers were actually able to customize the message(that is if we want to leave where it says changes may not be saved) that was displayed here, but then of course, many people started to abuse this. And so now we can only see it as a generic message. So no matter what we write here(that is the e.returnValue = 'anything'), we will always get this same pop-up('changes may not be saved one's '). Okay. */
// })
