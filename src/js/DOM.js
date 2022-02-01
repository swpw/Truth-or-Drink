import getQuestions from './getQuestions'
import sliderLogic from './slider'

class DOM {
  constructor(root){
    this.root = root
  }

  static createElement = (insertTO, template) => {
    const el = document.createElement('div')
    insertTO.appendChild(el)
    el.outerHTML = template
  }

  static clearElements = insertTO => insertTO.innerHTML = ''
}

export class MainMenu extends DOM{
  constructor(root){
    super(root)

    this.template = 
      `<section class="mainMenu">
        <div class="mainMenu__imageContainer"></div>
        <section class="mainMenu__sectionContent">
          <section class="mainMenu__sectionTop">
            <h1 class="mainMenu__title">Truth or Drink</h1>
            <p class="mainMenu__paragraphCatchphrase">Answer the question, or<br> take a drink</p>
            <p class="mainMenu__paragraphDescription">By the end of the night, we’ll all be better friends after asking the questions we’ve never dared to ask out loud. If anything, it’s worth a shot. </p>
          </section>
          <section class="mainMenu__sectionBot">
            <button id="btn-game" class="mainMenu__button">Play the game</button>
          </section>
        </section>
      </section>`

    DOM.clearElements(this.root)
    DOM.createElement(this.root, this.template)

    const playButton = document.querySelector('#btn-game')
    playButton.addEventListener('click', () => new Game(this.root))
  }
}

class Header extends DOM{
  constructor(root){
    super(root)
    
    this.template = `<header class="header">
      <h1 class="header__logo">Truth or Drink</h1>
      <img class="header__close" src="./assets/close.svg" alt="close">
    </header>`

    DOM.createElement(this.root, this.template)

    const closeButton = document.querySelector('.header__close')
    closeButton.addEventListener('click', () => new MainMenu(this.root))
  }
}

class Game extends DOM{
  constructor(root){
    super(root)

    getQuestions()
      .then(questions => {
        this.ui(this.root, questions)
        return questions
      })
      .then(questions => sliderLogic(this.root, questions))
  }

  ui(root, questions){
    const { difficulty, id, en } = questions
    
    DOM.clearElements(root)
    new Header(root)

    /* 1/3 Append slides wrapper template into DOM*/
    const templateSlidesWrapper = `<div class="glide">
        <div class="glide__track" data-glide-el="track">
          <ul class="glide__slides">
          </ul>
        </div>
      </div>`

    DOM.createElement(root, templateSlidesWrapper)

    const slidesWrapper = document.querySelector('.glide__slides')

    /* 2/3 Append all questions into DOM */
    for(let { difficulty, en, id } of questions){
      const templateQuestion = `<li class="game">
          <section class="game__content game__content--${difficulty}">
            <h2 class="game__title game__title--${difficulty}">${difficulty} #${id}</h2>
            <p class="game__description">${en}</</p>
          </section>
          <div class="game__icon doubleTap">
            <div class="doubleTap__icon"></div>
            <p class="doubleTap__text">Double tap <br>to next question</p>
          </div>
        </li>`

      DOM.createElement(slidesWrapper, templateQuestion)
    }

    /* 3/3 Append end of questions template into DOM */
    const templateEndofQuestions = `<li class="game">
          <section class="game__content">
            <h2 class="game__End-title">The End of The Questions</h2>
          </section>
          <div class="game__icon doubleTap">
            <div class="doubleTap__icon"></div>
            <p class="doubleTap__text">Double tap <br>to return to menu</p>
          </div>
        </li>`

    DOM.createElement(slidesWrapper, templateEndofQuestions)
  }
}