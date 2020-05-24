//Functions and values used in multiple "modules"
//-----------------------------------------------

const common = {
  createNewElement: function ({tagName = 'div', parent, classesArr, attributeNameValuePairs, text}) {
    const newElement = document.createElement(tagName);
    if (parent) {parent.append(newElement)};
    if (classesArr) {classesArr.forEach(className => newElement.classList.add(className))};
    if (text) {newElement.textContent = text};
    if (attributeNameValuePairs) {
      Object.entries(attributeNameValuePairs).forEach(([attributeName, value]) => {
        newElement.setAttribute(attributeName, value);
      })
    };
    return newElement;
  },
  getValueOfProperty: function (element, propertyName) {
    return window.getComputedStyle(element).getPropertyValue(propertyName);
  },
  mergeArraysAndRemoveRepeats: function (arrayOfArrays) {
    let mergedArray = [];
    arrayOfArrays.forEach(arr => mergedArray = mergedArray.concat(arr));
    const uniqueValues = new Set(mergedArray);
    return uniqueValues;
  },
  displayRefreshFrequency: 8, // 8ms ~ 120hz
  newElementInsertedInDomEvent: new CustomEvent ('elementinserted', {bubbles: true}),
  Throttle: class {
    constructor(functionName, functionParametersArr, interval, functionContext) {
      this.functionToCall = functionName;
      this.functionParametersArr = functionParametersArr;
      this.interval = interval;
      this.context = functionContext || this;
    };
    invokeFunction() {
      this.functionToCall.apply(this.context, this.functionParametersArr);
    };
    execute(functionParametersArr) {
      this.functionParametersArr = functionParametersArr;
      if (!this.isThrottled) {
        this.invokeFunction();
        this.throttle();
      } else {
        this.isEventFiredWhileThrottled = true;
      };
    };
    throttle() {
      this.isThrottled = true;
      this.timer = setTimeout(this.unthrottle.bind(this), this.interval);
    };
    unthrottle() {
      this.isThrottled = false;
      if (this.isEventFiredWhileThrottled) {
        this.isEventFiredWhileThrottled = false;
        this.execute(this.functionParametersArr);
      };
    };
  }
};

//Creating the projects cards and setting up the filter in preferences menu
//-------------------------------------------------------------------------

(async function() {
  const fetchJson = await fetch('resources/projects.json');
  const projectsData = await fetchJson.json();

  const cards = [];
  let skillsList;
  let refreshProjectsListTimeout;
  const browsers = (function() {
    let allSupportedBrowsers = [];
    Object.keys(projectsData).forEach(project => allSupportedBrowsers.push(projectsData[project]['supportedBrowsers']));
    return common.mergeArraysAndRemoveRepeats(allSupportedBrowsers);
  })();

  class ProjectCard {
    constructor(obj) {
      this.container = common.createNewElement({
        tagName: 'li',
        classesArr: ['project__card'],
      });
      this.link = this.createLink(obj);
      this.thumbnail = this.createThumbnail(obj);
      this.supportedBrowsersTab = this.createSupportedBrowsersTab(obj);
      this.descriptionTab = this.createDescriptionTab(obj);
      this.skills = obj['skills'];
    };
    createLink(obj) {
      const link = common.createNewElement({
        tagName: 'a',
        parent: this.container,
        classesArr: ['project__link', 'mouse-stalker-hoverable'],
        attributeNameValuePairs: {'href': obj['link'], 'target': '_blank', 'aria-label': obj['title']},
      });
      const linkCaption = common.createNewElement({
        tagName: 'span',
        parent: link,
        classesArr: ['project__link-caption', 'visually-hidden'],
        text: obj['title'],
      });
      const arrowIcon = createSvgUseElement({
        svgIconName: '#icon-link',
        parent: link,
        classesArr: ['project__link-svg'],
      });
      return link;
    };
    createThumbnail(obj) {
      let thumbnail;
      if ('HTMLPortalElement' in window) {
        thumbnail = this.createPortal(obj);
      } else {
        thumbnail = common.createNewElement({
          tagName: 'img',
          parent: this.container,
          classesArr: ['project__thumbnail', 'project__thumbnail--img'],
          attributeNameValuePairs: {'src': `resources/${obj['title']}.jpg`, 'alt': `${obj['title']} thumbnail`}
        });
      };
      return thumbnail;
    };
    createPortal(obj) {
      const portal = common.createNewElement({
        tagName: 'portal',
        parent: this.container,
        classesArr: ['project__thumbnail', 'project__thumbnail--portal'],
        attributeNameValuePairs: {'src': obj['link']},
      });
      this.link.addEventListener('click', (event) => {
        event.preventDefault();
        this.travelThroughPortal(event);
      });
      return portal;
    };
    createSupportedBrowsersTab(obj) {
      const list = common.createNewElement({
        tagName: 'ul',
        parent: this.container,
        classesArr: ['project__browser-support-list'],
      });
      browsers.forEach( browser => {
        const listItem = common.createNewElement({
          tagName: 'li',
          parent: list,
          classesArr: ['project__browser-support', `project__browser-support--${browser}`],
        });
        const svgIcon = createSvgUseElement({
          svgIconName: `#icon-browser-${browser}`,
          parent: listItem,
        });
        if (!obj['supportedBrowsers'].includes(browser)) {listItem.classList.add('project__browser-support--not-supported')}
      });
      return list;
    };
    createDescriptionTab(obj) {
      const descriptionWrapper = common.createNewElement({
        parent: this.container,
        classesArr: ['project__description-wrapper'],
      });
      const description = common.createNewElement({
        tagName: 'p',
        parent: descriptionWrapper,
        classesArr: ['project__description'],
        attributeNameValuePairs: {'data-lang-ru': obj['description'], 'data-lang-en': obj['data-lang-en']},
        text: obj['description'],
      });
      return descriptionWrapper;
    }
    travelThroughPortal() {
      const portalContainer = event.currentTarget.parentElement;
      const portal = this.thumbnail;
      let portalDimensions = portal.getBoundingClientRect();
      let animationValues = {
        '--x-offset': `${portalDimensions.left}px`,
        '--y-offset': `${portalDimensions.top}px`
      };
      for (let [propertyName, value] of Object.entries(animationValues)) {
        portalContainer.style.setProperty(propertyName, value)
      }
      portalContainer.classList.add('project__card--portal-transition');
      portal.addEventListener('transitionend', function (event) {
        portal.activate();
      });
    };
  };

  class SkillsItem {
    constructor(technology) {
      this.container = common.createNewElement({
        tagName: 'li',
        classesArr: ['skills__skill-container'],
      });
      this.checkbox = common.createNewElement({
        tagName: 'input',
        parent: this.container,
        classesArr: ['skills__skill-checkbox', 'visually-hidden'],
        attributeNameValuePairs: {'type': 'checkbox', 'name': `${technology}`, 'id': technology, 'checked': 'true'},
      });
      this.label = common.createNewElement({
        tagName: 'label',
        parent: this.container,
        classesArr: ['skills__skill-label', 'mouse-stalker-hoverable'],
        attributeNameValuePairs: {'for': technology, 'data-stalker-radius': '10px', 'data-stalker-animation-duration': '500'},
        text: technology,
      });
    }
  };

  const createSvgUseElement = ({svgIconName, parent, classesArr}) => {
    const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', svgIconName);
    svgContainer.append(svgUse);
    if(classesArr) {classesArr.forEach(className => svgContainer.classList.add(className))};
    if (parent) {parent.append(svgContainer)};
    return svgContainer
  }

  const createAndFillProjectsList = (source) => {
    const projectsList = common.createNewElement({
      tagName: 'ul',
      classesArr: ['portfolio__projects-list'],
    });
    for (let project in source) {
      const projectCard = new ProjectCard(projectsData[project]);
      cards.push(projectCard);
      projectsList.append(projectCard['container']);
    }
    return projectsList
  };

  const fillUsedTechnologiesSelectors = (source, projectsList) => {
    skillsList = common.createNewElement({
      tagName: 'ul',
      classesArr: ['skills__list'],
    });
    let skills = [];
    for (let obj in source) {
      skills.push(source[obj]['skills']);
    };
    skills = common.mergeArraysAndRemoveRepeats(skills);
    skills.forEach(str => {
      const newItem = new SkillsItem(str)
      skillsList.append(newItem['container']);
      newItem['checkbox'].addEventListener('change', function(event) {
        clearTimeout(refreshProjectsListTimeout);
        projectsList.classList.add('portfolio__projects-list--updating');
        refreshProjectsListTimeout = setTimeout(function() {
          refreshProjectsList(projectsList);
        }, 1200);
      });
    });
    document.querySelector('.preferences__skills').append(skillsList);
    skillsList.dispatchEvent(common.newElementInsertedInDomEvent);
  };

  const getSelectedSkills = () => {
    const selectedCheckboxes = skillsList.querySelectorAll('.skills__skill-checkbox:checked');
    let selectedSkills = [];
    selectedCheckboxes.forEach(element => selectedSkills.push(element.id));
    return selectedSkills;
  };

  const refreshProjectsList = (projectsList) => {
    const selectedSkills = getSelectedSkills();
    cards.forEach(card => {
      let containsSelectedSkills = card['skills'].some(skill => selectedSkills.includes(skill));
      (containsSelectedSkills) ? card['container'].classList.remove('project__card--hide'): card['container'].classList.add('project__card--hide');
    });
    clearTimeout(refreshProjectsListTimeout);
    setTimeout(function() {projectsList.classList.remove('portfolio__projects-list--updating')}, 300);
  };

  (function() {
    const filledList = createAndFillProjectsList(projectsData);
    fillUsedTechnologiesSelectors(projectsData, filledList);
    document.querySelector('.portfolio__loader').remove();
    document.querySelector('.portfolio').prepend(filledList);
    filledList.dispatchEvent(common.newElementInsertedInDomEvent);
    document.querySelector('.preferences__btn').addEventListener('click', function (event) {
      refreshProjectsList(filledList);
    })
  })();
})();

// Theme switch
//-------------

(function() {
  const themeSwitcher = document.querySelector('.site-preferences__checkbox--theme-switch');
  const mapThemesStyles = {
    ' light': {
      '--theme': ' light',
      '--background-color': 'rgb(244, 247, 246)',
      '--background-darker-color': 'rgb(210, 210, 216)',
      '--border-color': 'rgb(200, 205, 215)',
      '--box-shadow-color': 'rgba(150, 155, 165, 0.3)',
      '--font-color': 'rgb(32, 33, 96)',
      '--main-color': 'rgb(223, 108, 79)',
      '--error': 'rgb(223, 79, 79)',
    },
    ' dark': {
      '--theme': ' dark',
      '--background-color': 'rgb(40, 44, 52)',
      '--background-darker-color': 'rgb(33, 37, 43)',
      '--border-color': 'rgb(29, 31, 35)',
      '--box-shadow-color': 'rgba(19, 21, 25, 0.3)',
      '--font-color': 'rgb(171, 178, 191)',
      '--main-color': 'rgb(209, 154, 102)',
      '--error': 'rgb(224, 108, 117)',
    }
  };

  const setTheme = (theme) => {
    for (let [propertyName, value] of Object.entries(mapThemesStyles[theme])) {
      document.documentElement.style.setProperty(propertyName, value);
    };
    localStorage.setItem('theme', theme);
  };

  themeSwitcher.addEventListener('change', function (event) {
    (themeSwitcher.checked) ? setTheme(' dark') : setTheme(' light');
  });

  if (localStorage.getItem('theme')) {
    setTheme(localStorage.getItem('theme'));
  };

  if (common.getValueOfProperty(document.documentElement, '--theme') === ' dark') {
    themeSwitcher.checked = true;
  };
})();

// Mouse stalker (circle under mouse pointer)
//-------------------------------------------

(function() {
  const mouseStalker = {
    stalker: common.createNewElement({
      classesArr: ['mouse-stalker'],
    }),
    isSticked: false,
    create: function () {
      const hoverableElements = document.querySelectorAll('.mouse-stalker-hoverable');
      document.body.append(mouseStalker.stalker);
      mouseStalker.adjust(event);
      mouseStalker.throttledAdjust = new common.Throttle(mouseStalker.adjust, [event], common.displayRefreshFrequency, mouseStalker);
      document.addEventListener('mousemove', function (event) {
        mouseStalker.throttledAdjust.execute([event]);
      });
      hoverableElements.forEach(element => {
        mouseStalker.addListenersToHoverTarget(element);
      });
      document.addEventListener('elementinserted', function (event) {
        const hoverableElements = event.target.querySelectorAll('.mouse-stalker-hoverable');
        hoverableElements.forEach(element => {
          mouseStalker.addListenersToHoverTarget(element);
        })
      });
      document.removeEventListener('mousemove', mouseStalker.create);
    },
    setPosition: function (xPos, yPos) {
      this.stalker.style.setProperty('transform', `translate(${xPos}px,${yPos}px)`);
    },
    adjust: function (event) {
      if (this.isSticked) {
        const dimensions = this.hoverTarget.getClientRects()[0];
        yPos = dimensions['y'] - dimensions['height'] * 0.1;
        xPos = dimensions['x'] - dimensions['width'] * 0.1;
      } else {
        yPos = event.clientY - (this.stalker.offsetHeight * 0.5);
        xPos = event.clientX - (this.stalker.offsetWidth * 0.5);
      }
      this.setPosition(xPos, yPos);
    },
    stickToElement: function (element) {
      this.isSticked = true;
      if(element.dataset.stalkerTargetInside) {
        this.hoverTarget = element.querySelector(`.${element.dataset.stalkerTargetInside}`);
      } else {
        this.hoverTarget = element;
      };
      if(element.dataset.stalkerRadius) {this.stalker.style.setProperty('border-radius', element.dataset.stalkerRadius)};
      if(element.dataset.stalkerAnimationDuration) {
        this.adjustAfterTransition(this.hoverTarget, element.dataset.stalkerAnimationDuration)
      } else {
        this.updateStalkerDimensions()
      };
    },
    unstick: function (event) {
      this.isSticked = false;
      this.stalker.style.width = null;
      this.stalker.style.height = null;
      this.timerIfTargetMoving = null;
      this.stalker.style.removeProperty('border-radius');
    },
    adjustAfterTransition: function(element, speed) {
      const context = this;
      let i = speed / common.displayRefreshFrequency;
      const followStickedElement = () => {
        if (context.hoverTarget === element && context.isSticked === true && i > 0) {
          context.updateStalkerDimensions();
          context.adjust();
          i--;
          setTimeout(followStickedElement, common.displayRefreshFrequency);
        };
      }
      setTimeout(followStickedElement, common.displayRefreshFrequency);
    },
    updateStalkerDimensions: function() {
      const dimensions = this.hoverTarget.getClientRects()[0];
      const stalkerWidth = dimensions['width'] * 1.2;
      const stalkerHeight = dimensions['height'] * 1.2;
      this.setDimensions(stalkerWidth, stalkerHeight);
    },
    setDimensions: function (stalkerWidth, stalkerHeight) {
      this.stalker.style.width = `${stalkerWidth}px`;
      this.stalker.style.height = `${stalkerHeight}px`;
    },
    addListenersToHoverTarget: function (element) {
      element.addEventListener('mouseenter', function (event) {
        mouseStalker.stickToElement(event.currentTarget);
      });
      element.addEventListener('mouseleave', function (event) {
        mouseStalker.unstick();
      });
    }
  };

  if(!('ontouchstart' in window)) {document.addEventListener('mousemove', mouseStalker.create)};
})();

// Adjust btns position on mouse move to stay on the same axis with mouse
//-----------------------------------------------------------------------

(async function() {
  const btnsStickToMouse = {
    topBtn: document.querySelector('.about-me__btn'),
    sideBtn: document.querySelector('.preferences__btn'),
    getDimensions: function() {
      this.btnsSideLength = common.getValueOfProperty(this.topBtn, 'width').replace('px', '');
      this.topBtnOffset = (document.documentElement.clientWidth - this.btnsSideLength) / 2;
      this.sideBtnOffset = (document.documentElement.clientHeight - this.btnsSideLength) / 2;
    },
    setPosition: function (element, cursorPosition, axis) {
      this.allowedPositionRangeX = [0, document.documentElement.clientWidth - this.btnsSideLength];
      this.allowedPositionRangeY = [this.btnsSideLength * 1.2, document.documentElement.clientHeight - this.btnsSideLength];
      let rangeMin, rangeMax, offset;
      if (axis === 'X') {
        offset = this.topBtnOffset;
        [rangeMin, rangeMax] = [this.allowedPositionRangeX[0] - offset, this.allowedPositionRangeX[1] - offset];
      } else {
        offset = this.sideBtnOffset;
        [rangeMin, rangeMax] = [this.allowedPositionRangeY[0] - offset, this.allowedPositionRangeY[1] - offset];
      };
      let position = cursorPosition - this.btnsSideLength * 0.5 - offset;
      if (position < rangeMin) {
        position = rangeMin;
      } else if (position > rangeMax) {
        position = rangeMax;
      };
      element.style.setProperty('--adjusted-position', `translate${axis}(${position}px)`)
    },
    adjustBtns: function (event) {
      this.setPosition(this.topBtn, event.clientX, 'X');
      this.setPosition(this.sideBtn, event.clientY, 'Y');
    },
  };

  if(!('ontouchstart' in window)) {
    const throttledBtnsStickToMouse = new common.Throttle(btnsStickToMouse.adjustBtns, [event], common.displayRefreshFrequency, btnsStickToMouse);
    btnsStickToMouse.getDimensions();

    window.addEventListener('resize', function (event) {
      btnsStickToMouse.getDimensions();
    });

    document.addEventListener('mousemove', function (event) {
      throttledBtnsStickToMouse.execute([event]);
    });
  }
})();

//Show/hide modal containers
//--------------------------

(function() {
  const modalElements = document.querySelectorAll('.modal');
  modalElements.forEach(element => {
    const btn = element.querySelector('.modal__toggle');

    btn.addEventListener('click', function() {
      element.classList.toggle('modal--show');
      btn.classList.toggle('modal__toggle--toggled');
    })
  });
})();

//Show foldable description on hover/focus
//----------------------------------------

(function() {
  class UnfoldableDescriptonsList {
    constructor(nodeList) {
      this.currentUnfoldedDescription = null;
      nodeList.forEach(element => new UnfoldableDescription(element, this));
    };
    maintainOneDescriptionUnfolded(hoveredElement) {
      if (this.currentUnfoldedDescription !== hoveredElement && this.currentUnfoldedDescription !== null) {this.hidePreviouslyUnfoldedDescription()};
      if (this.currentUnfoldedDescription !== hoveredElement) {this.currentUnfoldedDescription = hoveredElement};
    };
    hidePreviouslyUnfoldedDescription() {
      this.currentUnfoldedDescription.hideText(this.currentUnfoldedDescription);
    };
  };

  class UnfoldableDescription {
    constructor(element, list) {
      this.container = element;
      this.fullText = element.dataset.unfoldContent;
      this.foldableTextContainer = common.createNewElement({
        tagName: 'span',
        parent: this.container.querySelector('.contacts__link'),
        classesArr: ['contacts__unfoldableText'],
      });
      this.animationSpeed = common.getValueOfProperty(element, 'transition-duration').replace('s', '') * 1000;
      this.paintingSpeed = Math.floor(this.animationSpeed / this.fullText.length);
      this.list = list;
      this.addEventListeners(this);
    };
    showText(context) {
      context.list.maintainOneDescriptionUnfolded(context);
      clearTimeout(context.textIsPainting);
      if (context.foldableTextContainer.textContent.length < context.fullText.length && window.innerWidth > 1100) {
        context.textIsPainting = setTimeout(function() {
          context.foldableTextContainer.textContent = context.foldableTextContainer.textContent + context.fullText[context.foldableTextContainer.textContent.length];
          context.showText(context);
        }, context.paintingSpeed);
      };
    };
    hideText(context) {
      clearTimeout(context.textIsPainting);
      if (context.foldableTextContainer.textContent.length !== 0) {
        context.textIsPainting = setTimeout(function() {
          context.foldableTextContainer.textContent = context.foldableTextContainer.textContent.slice(0, -1);
          context.hideText(context);
        }, (context.paintingSpeed * 0.7));
      };
    };
    addEventListeners(context) {
      context.container.addEventListener('mouseenter', function(event) {
        context.showText(context);
      });
      context.container.addEventListener('focusin', function(event) {
        context.showText(context);
      });
      context.container.addEventListener('mouseleave', function(event) {
        if(context.container.querySelector('a') !== document.activeElement) {
          context.hideText(context);
        };
      });
      context.container.addEventListener('focusout', function(event) {
        context.hideText(context);
      });
      window.addEventListener('resize', function(event) {
        if(window.innerWidth < 1100 && context.foldableTextContainer.textContent.length !== 0) {context.hideText(context)};
      });
    }
  };

  new UnfoldableDescriptonsList(document.querySelectorAll('.contacts__contact'));

})();

//Change language
//---------------

(function() {
let multilanguageContainers = document.querySelectorAll('[data-lang-ru]');
const changeLanguageCheckbox = document.querySelector('.site-preferences__checkbox--language-change');
const title = {
  'Ru': 'Портфолио',
  'En': 'Portfolio'
};
const changeLanguage = (language) => {
  multilanguageContainers.forEach(element => element.textContent = element.dataset[(`lang${language}`)]);
  document.title = title[language];
  updateCheckbox(language);
  document.documentElement.setAttribute('lang', language.toLowerCase());
  localStorage.setItem('language', language);
};
const applyLanguageToNewElements = (event) => {
  const newMultilanguageContainers = event.target.querySelectorAll('[data-lang-ru]');
  if (newMultilanguageContainers) {
    newMultilanguageContainers.forEach(element => element.textContent = element.dataset[(`lang${localStorage.getItem('language')}`)]);
    multilanguageContainers = [...multilanguageContainers, ...newMultilanguageContainers];
  }
};
const updateCheckbox = (language) => {
  (language === 'En') ? changeLanguageCheckbox.checked = true : changeLanguageCheckbox.checked = false;
}


if (localStorage.getItem('language')) {
  changeLanguage(localStorage.getItem('language'));
} else if (navigator.languages.includes('ru')) {
  changeLanguage('Ru');
} else {
  changeLanguage('En');
};

changeLanguageCheckbox.addEventListener('change', function (event) {
  (changeLanguageCheckbox.checked) ? changeLanguage('En') : changeLanguage('Ru');
});

document.addEventListener('elementinserted', function (event) {
  applyLanguageToNewElements(event);
});
})();

//Safari z-index bug workaround
//-----------------------------

document.addEventListener('elementinserted', function (event) {
  if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
    document.addEventListener('elementinserted', function (event) {
      const cards = event.target.querySelectorAll('.project__card');
      if(cards) {
        cards.forEach(card => {
          card.style.transform = 'none';
          card.style.boxShadow = '0 0 10px 10px var(--border-color)';
        });
      };
    });
  };
});

//Add this script as a skewed background text
//-------------------------------------------

(function() {
  const fetchFileAsText = async (relativePath) => {
    let fetchFile = await fetch(relativePath);
    let fileAsText = await fetchFile.text();
    return fileAsText;
  };
  const processScriptThroughWorker = async (script) => {
    const worker = new Worker('worker.js');
    worker.postMessage(script);
    let scriptReadyForInsertion = new Promise(resolve => {
      worker.onmessage = (message) => {
        resolve(message.data);
        worker.terminate();
      };
    });
    return scriptReadyForInsertion;
  };
  const displayScriptAsBackground = async (relativePath) => {
    const wrapper = common.createNewElement({
      parent: document.querySelector('.portfolio'),
      classesArr: ['code-as-background__wrapper'],
    });
    const codeContainer = common.createNewElement({
      parent: wrapper,
      tagName: 'code',
      classesArr: ['code-as-background'],
    });
    const adjustCodeBackgroundHeight = () => {
      const remToPixels = (int) =>{return getComputedStyle(document.documentElement).fontSize.replace('px', '') * int};
      wrapper.style.height = `${parent.offsetHeight}px`;
      if(codeContainer.offsetHeight < parent.offsetHeight + remToPixels(18)) {
        codeContainer.innerHTML = `${codeContainer.innerHTML}${codeContainer.innerHTML}`;
        adjustCodeBackgroundHeight();
      };
    };
    let script = await fetchFileAsText(relativePath);
    codeContainer.innerHTML = await processScriptThroughWorker(script);
    wrapper.append(codeContainer);
    adjustCodeBackgroundHeight();
    parent.addEventListener('transitionend', adjustCodeBackgroundHeight);
    document.addEventListener('elementinserted', adjustCodeBackgroundHeight);
  };

  displayScriptAsBackground('script.js');
})();