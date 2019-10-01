!function(){let e=document.querySelector(".site-nav__menu-toggle"),t=document.querySelector(".site-nav__list"),n=document.querySelectorAll(".site-nav__sub-menu-toggle"),i=document.querySelectorAll(".site-nav__sub-menu");e.addEventListener("click",function(){e.classList.toggle("site-nav__menu-toggle--toggled"),t.classList.toggle("site-nav__list--open")});for(let e=0;e<i.length;e++){let t=n[e],o=i[e];t.addEventListener("click",function(){t.classList.toggle("site-nav__sub-menu-toggle--toggled"),o.classList.toggle("site-nav__sub-menu--open")})}}(),function(){const e=["no-js--remove"];for(let t of e){let e=document.querySelectorAll("."+t);for(let n of e)n.classList.remove(t)}}(),function(){const e=document.querySelector(".header"),t=document.querySelector(".scroll-to-top"),n=document.querySelector(".about__pictures-container"),i=document.querySelector(".about__img--left"),o=document.querySelector(".about__img--right"),s=()=>{(document.body.scrollTop||document.documentElement.scrollTop)&&(window.scrollBy(0,-Math.max(10,200)),window.requestAnimationFrame(s))};t.removeAttribute("href"),t.addEventListener("click",function(e){e.preventDefault,s()}),document.addEventListener("scroll",function(s){document.body.scrollTop>0||document.documentElement.scrollTop>0?(e.classList.add("header--sticky"),t.classList.add("scroll-to-top--show")):(e.classList.remove("header--sticky"),t.classList.remove("scroll-to-top--show")),(()=>{let e,t=2*n.clientHeight,s=(1.8*n.clientHeight-(n.getBoundingClientRect().y||n.getBoundingClientRect().top))/t;e=s<0?0:s>1?15:15*s,i.style.transform="translateY("+-1*e+"%)",o.style.transform="translateY("+e+"%)"})()})}(),function(){let e=document.querySelectorAll(".form__input"),t=document.querySelector(".form__btn");for(let t of e)t.addEventListener("blur",function(){t.classList.add("form__input--changed")});t.addEventListener("click",function(t){t.preventDefault();for(let t of e)if(!0===t.required&&!t.checkValidity()){customAlert.show("Form is not filled correctly");for(let t of e)t.classList.add("form__input--changed");return}customAlert.show("We will contact you as soon as possible!");for(let t of e)t.value=""})}(),function(){const e={getScrollDirection:function(e){return e.deltaY<0?"right":"left"},scrollHandler:function(e,t){if(t.items.length>t.itemsVisible()){e.stopPropagation();let n=this.getScrollDirection(e);window.event.preventDefault(),this.slide(t,n)}},adjust:function(e){let t;if(e.resizeToFill){t=document.body.clientWidth/e.itemsVisible();for(let n of e.items)n.style.width=t+"px",n.style.height=.59*t+"px"}else t=e.items[0].clientWidth;let n=+window.getComputedStyle(e.items[0])["margin-right"].replace("px","");e.stepWidth=t+n,e.resizeToFill&&(e.list.style.width=(t+n)*e.items.length-n+"px"),e.list.style.transform="translateX("+e.currentItem*e.stepWidth*-1+"px)",e.radioBtns&&this.whichRadioBtnChecked(e)},adjustRadioBtns:function(t){let n=Math.ceil(t.items.length/t.itemsVisible());if(n===t.radioBtns.length)return;t.radioBtnsContainer.innerHTML="";let i=document.createElement("input");i.type="radio",i.name=t.name+"-carousel",i.className=t.name+"__radio-btn visually-hidden";let o=document.createElement("label");o.className=t.name+"__label";for(let e=0;e<n;e++){let n=i.cloneNode(!0),s=o.cloneNode(!0);n.id=t.name+"-radio-"+e,s.setAttribute("for",t.name+"-radio-"+e),s.innerHTML='<span class="visually-hidden">Button №'+(e+1)+"<span>",t.radioBtnsContainer.appendChild(n),t.radioBtnsContainer.appendChild(s)}t.refreshRadioBtns();let s=document.querySelectorAll("."+t.name+"__label");for(let n=0;n<s.length;n++)t.radioBtns[n].addEventListener("input",function(i){let o;o=n!==s.length-1?n*t.itemsVisible():t.items.length-t.itemsVisible(),e.slideTo(t,o),t.radioBtns[n].checked=!0})},whichRadioBtnChecked:function(e){let t=e.itemsVisible();for(let n=0;n<e.radioBtns.length;n++)e.currentItem<=t*(n+1)-1&&e.currentItem>t*n-1&&(e.radioBtns[n].checked=!0);e.currentItem+1>=t*Math.floor(e.items.length/t)&&(e.radioBtns[e.radioBtns.length-1].checked=!0)},slideStoppedAtEdge:function(e,t){e.freeze=!0,"right"===t?e.currentItem--:e.currentItem++,e.items[e.currentItem].classList.add("carousel__current-item");for(let n of e.items)n.classList.add("carousel__at-the-edge--"+t);e.items[1].addEventListener("animationend",function(n){for(let n of e.items)n.classList.remove("carousel__at-the-edge--"+t);e.freeze=!1})},slideBeyond:function(e,t){e.freeze=!0;for(let n of e.items)n.classList.add("carousel__slide--"+t);"left"===t?(e.list.insertBefore(e.items[e.items.length-1],e.items[0]),e.currentItem=0):(e.list.insertBefore(e.items[0],e.items[e.items.length]),e.currentItem=e.items.length-e.itemsVisible()),e.items[1].addEventListener("animationend",function(n){for(let n of e.items)n.classList.remove("carousel__slide--"+t);e.freeze=!1}),e.refreshItems(),e.items[e.currentItem].classList.add("carousel__current-item"),this.adjust(e)},slide:function(e,t){e.items[e.currentItem].classList.remove("carousel__current-item"),e.freeze||("right"===t?e.currentItem++:e.currentItem--,e.currentItem<0?e.stopAtEdge?this.slideStoppedAtEdge(e,t):this.slideBeyond(e,t):e.currentItem>e.items.length-e.itemsVisible()?e.stopAtEdge?this.slideStoppedAtEdge(e,t):this.slideBeyond(e,t):(e.items[e.currentItem].classList.add("carousel__current-item"),this.adjust(e),e.radioBtns&&this.whichRadioBtnChecked(e),e.list.style.transform="translateX("+e.currentItem*e.stepWidth*-1+"px)"))},slideTo:function(e,t){e.currentItem=t,this.adjust(e)},swipe:function(e){let t=this.swipeInformation.calledFrom;if(!t||!t.swipe)return;let n=e-this.swipeInformation.x;this.swipeInformation={},Math.abs(n)<60||(n<0?this.slide(t,"right"):this.slide(t,"left"))},swipeInformation:{}},t={name:"staff",container:document.querySelector(".staff__carousel"),list:document.querySelector(".staff__list"),items:document.querySelectorAll(".staff__person"),radioBtns:0,radioBtnsContainer:document.querySelector(".staff__form"),currentItem:0,stopAtEdge:!0,resizeToFill:!1,swipe:"horizontal",itemsVisible:function(){return window.innerWidth>=992?3:window.innerWidth>=768?2:1},refreshRadioBtns:function(){this.radioBtns=document.querySelectorAll(".staff__radio-btn")},refreshItems:function(){this.items=document.querySelectorAll(".staff__person")}},n={name:"reviews",container:document.querySelector(".reviews__carousel"),list:document.querySelector(".reviews__list"),items:document.querySelectorAll(".reviews__review"),radioBtns:0,radioBtnsContainer:document.querySelector(".reviews__form"),currentItem:0,stopAtEdge:!0,resizeToFill:!1,swipe:"horizontal",itemsVisible:function(){return window.innerWidth>=768?2:1},refreshRadioBtns:function(){this.radioBtns=document.querySelectorAll(".reviews__radio-btn")},refreshItems:function(){this.items=document.querySelectorAll(".reviews__review")}},i={container:document.querySelector(".gallery__container"),list:document.querySelector(".gallery__images"),items:document.querySelectorAll(".gallery__image-wrapper"),btnLeft:document.querySelector(".gallery__btn--previous"),btnRight:document.querySelector(".gallery__btn--next"),currentItem:0,stopAtEdge:!1,resizeToFill:!0,swipe:"horizontal",itemsVisible:function(){return window.innerWidth>=700?3:window.innerWidth>=520?2:1},refreshItems:function(){this.items=document.querySelectorAll(".gallery__image-wrapper")}},o=[t,n,i];window.addEventListener("resize",function(t){for(let t of o)t.currentItem+t.itemsVisible()>=t.items.length&&(t.currentItem=t.items.length-t.itemsVisible()),void 0!==t.radioBtns&&t.items.length>t.itemsVisible()&&e.adjustRadioBtns(t),e.adjust(t)});for(let t of o)t.container.addEventListener("dragstart",function(e){e.preventDefault()}),void 0!==t.radioBtns&&t.items.length>t.itemsVisible()&&e.adjustRadioBtns(t),t.btnLeft&&(t.btnLeft.addEventListener("click",function(n){e.slide(t,"left")}),t.btnRight.addEventListener("click",function(n){e.slide(t,"right")})),t.container.addEventListener("wheel",function(n){e.scrollHandler(n,t)},{passive:!1}),t.container.addEventListener("mousedown",function(n){let i={x:n.screenX,calledFrom:t};e.swipeInformation=i,setTimeout(function(){e.swipeInformation={}},2500)}),t.container.addEventListener("touchstart",function(n){let i={x:n.changedTouches[0].screenX,calledFrom:t};e.swipeInformation=i,setTimeout(function(){e.swipeInformation={}},2500)},{passive:!0}),t.container.addEventListener("mouseup",function(t){e.swipeInformation&&e.swipe(t.screenX)}),t.container.addEventListener("touchend",function(t){e.swipeInformation&&e.swipe(t.changedTouches[0].screenX)},{passive:!0}),e.adjust(t);const s={filled:!1,section:document.querySelector(".modal-gallery"),container:document.querySelector(".modal-gallery__carousel"),list:document.querySelector(".modal-gallery__list"),btnLeft:document.querySelector(".modal-gallery__btn--previous"),btnRight:document.querySelector(".modal-gallery__btn--next"),btnDownload:document.querySelector(".modal-gallery__btn--download"),btnCollapse:document.querySelector(".modal-gallery__btn--collapse"),btnClose:document.querySelector(".modal-gallery__btn--close"),imgCounter:document.querySelector(".modal-gallery__image-counter"),currentItem:0,stopAtEdge:!1,resizeToFill:!1,swipe:"horizontal",itemsVisible:function(){return 1},refreshItems:function(){this.items=document.querySelectorAll(".modal-gallery__item")}},r=()=>{for(let e of s.items){let t;t=window.innerWidth>=768?320:150,e.style.marginRight=Math.ceil(document.body.clientWidth/2)-t+"px"}},l=e=>{(()=>{var e=document.createDocumentFragment();for(let t=0;t<i.items.length;t++){let n,o=i.items[t].querySelector("img"),s=document.createElement("li");n=window.innerWidth>=768?320:160,s.style.marginRight=Math.ceil(document.body.clientWidth/2)-n+"px",s.className="modal-gallery__item",s.dataset.id=i.items[t].dataset.id;let r=document.createElement("img");r.className="modal-gallery__uncompressed-image",r.src=o.src.replace("[.][a-zA-Z]{3,4}","-uc.jpg").replace("@2x",""),r.alt=o.alt,s.appendChild(r),e.appendChild(s)}s.list.appendChild(e),s.refreshItems()})(),(()=>{var e=document.createDocumentFragment();for(let t=0;t<i.items.length;t++){let n;for(let e of i.items)+e.dataset.id===t&&(n=e);let o=n.cloneNode(!0);o.classList.remove("gallery__image-wrapper"),o.classList.add("modal-gallery__thumbnail"),o.style.width="",o.style.height="";let s=o.querySelector("img");s.classList.remove("gallery__image"),s.classList.add("modal-gallery__thumbnail-image"),e.appendChild(o)}document.querySelector(".modal-gallery__thumbnails").appendChild(e),s.thumbnails=document.querySelectorAll(".modal-gallery__thumbnail");for(let e of s.thumbnails)e.addEventListener("click",function(e){d(e.currentTarget)})})(),s.filled=!0},a=()=>{for(let e=0;e<s.items.length;e++)s.thumbnails[e].classList.remove("modal-gallery__thumbnail--selected"),s.items[s.currentItem].dataset.id===s.thumbnails[e].dataset.id&&s.thumbnails[e].classList.add("modal-gallery__thumbnail--selected");s.btnDownload.href=s.items[s.currentItem].querySelector("img").src,s.imgCounter.textContent=+s.items[s.currentItem].dataset.id+1+"/"+s.items.length,r()},c=t=>{s.filled||(l(),m()),(t=>{for(let e=0;e<s.items.length;e++)t.dataset.id===s.items[e].dataset.id&&(s.currentItem=e);a(),window.requestAnimationFrame(function(){e.adjust(s)})})(t.currentTarget),document.querySelector(".modal-gallery").classList.add("modal-gallery--show")},d=t=>{if(t.classList.contains("modal-gallery__thumbnail--selected"))return;let n=t.dataset.id;for(let t=0;t<s.items.length;t++)if(n===s.items[t].dataset.id)return e.slideTo(s,t),void a()},m=()=>{s.btnClose.addEventListener("click",function(e){document.querySelector(".modal-gallery").classList.remove("modal-gallery--show")}),s.btnCollapse.addEventListener("click",function(e){document.querySelector(".modal-gallery__thumbnails-wrapper").classList.toggle("modal-gallery__thumbnails-wrapper--hide")}),s.container.addEventListener("dragstart",function(e){e.preventDefault()}),s.btnLeft&&(s.btnLeft.addEventListener("click",function(t){e.slide(s,"left"),a()}),s.btnRight.addEventListener("click",function(t){e.slide(s,"right"),a()})),s.section.addEventListener("wheel",function(t){e.scrollHandler(t,s),a()},{passive:!1}),s.container.addEventListener("mousedown",function(t){let n={x:t.screenX,calledFrom:s};e.swipeInformation=n,setTimeout(function(){e.swipeInformation={}},2500)}),s.container.addEventListener("touchstart",function(t){let n={x:t.changedTouches[0].screenX,calledFrom:s};e.swipeInformation=n,setTimeout(function(){e.swipeInformation={}},2500)},{passive:!0}),s.container.addEventListener("mouseup",function(t){e.swipeInformation&&(e.swipe(t.screenX),a())}),s.container.addEventListener("touchend",function(t){e.swipeInformation&&(e.swipe(t.changedTouches[0].screenX),a())},{passive:!0}),window.addEventListener("resize",function(t){e.adjust(s),r()})};for(let e of i.items)e.addEventListener("click",function(e){c(e)})}(),function(){if("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype){let e=document.querySelectorAll(".fade-in-up"),t=document.querySelectorAll(".animated-pseudo-element"),n=new IntersectionObserver(e=>{e.forEach(e=>{e.intersectionRatio>0&&(e.target.classList.contains("hidden-before-animation")?(e.target.classList.remove("hidden-before-animation"),e.target.classList.add("fade-in-up")):e.target.classList.contains("hide-pseudo-element")&&(e.target.classList.remove("hide-pseudo-element"),e.target.classList.add("animated-pseudo-element")),n.unobserve(e.target))})});for(let t=0;t<e.length;t++)e[t].classList.remove("fade-in-up"),e[t].classList.add("hidden-before-animation"),n.observe(e[t]);for(let e=0;e<t.length;e++)t[e].classList.remove("animated-pseudo-element"),t[e].classList.add("hide-pseudo-element"),n.observe(t[e])}}();const loadMap=()=>{let e=document.createElement("script");e.src="js/map-custom-colors.js",e.type="text/javascript",document.body.appendChild(e)};window.addEventListener("load",function(e){setTimeout(loadMap,1e3)}),function(){let e=document.querySelectorAll('a[href=""]');for(let t of e)t.addEventListener("click",function(e){e.preventDefault(),customAlert.show("For now, only this page is available")})}();const customAlert={modalAlert:document.querySelector(".modal-alert"),modalText:document.querySelector(".modal-alert__text"),show:function(e){this.modalText.textContent=e,this.modalAlert.classList.add("modal-alert--show")},hide:function(){this.modalAlert.classList.remove("modal-alert--show")}};document.querySelector(".modal-alert__close-btn").addEventListener("click",function(e){customAlert.hide()});