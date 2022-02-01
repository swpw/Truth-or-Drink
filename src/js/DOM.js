import Glide from '@glidejs/glide'

import getQuestions from './getQuestions'

export class DOM {
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

    this.template = `<section class="mainMenu">
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

    document.querySelector('#btn-game').addEventListener('click', () => new Game(this.root))
  }
}

export class Game extends DOM{
  constructor(root){
    super(root)

    getQuestions()
      .then(res => {
        this.buildDOM(this.root, res)
        return res
      })
      .then(res => this.logic(res))
  }

  buildDOM(root, questions){
    const template = questions => {
      const { difficulty, id, en } = questions

      let template = `<div class="glide">
          <div class="glide__track" data-glide-el="track">
            <ul class="glide__slides">
            </ul>
          </div>
        </div>`

      DOM.createElement(root, template)

      for(let question of questions){
        const { difficulty, en, id } = question

        template = `<li class="game">
            <section class="game__content game__content--${difficulty}">
              <h2 class="game__title game__title--${difficulty}">${difficulty} #${id}</h2>
              <p class="game__description">${en}</</p>
            </section>
            <div class="game__icon doubleTap">
              <div class="doubleTap__icon"></div>
              <p class="doubleTap__text">Double tap <br>to next question</p>
            </div>
          </li>`

        DOM.createElement(document.querySelector('.glide__slides'), template)
      }

      template = `<li class="game">
            <section class="game__content">
              <h2 class="game__End-title">The End of The Questions</h2>
            </section>
            <div class="game__icon doubleTap">
              <div class="doubleTap__icon"></div>
              <p class="doubleTap__text">Double tap <br>to return to menu</p>
            </div>
          </li>`

      DOM.createElement(document.querySelector('.glide__slides'), template)
    }

    DOM.clearElements(root)
    template(questions)
    new Header(root)
  }

  logic(questions){
    const glide = new Glide('.glide', {
      startAt: 0,
      perView: 1,
      gap: 0,
      perTouch: 1,
      animationDuration: 500,
      rewind: false
    }).mount()


    document.querySelector('.glide').addEventListener('dblclick', () => 
      glide._i === questions.length ? new MainMenu(this.root) : glide.go('>'))
  }
}

export class Header extends DOM{
  constructor(root){
    super(root)
    
    this.template = `<header class="header">
      <h1 class="header__logo">Truth or Drink</h1>
      <img class="header__close" src="./assets/close.svg" alt="close">
    </header>`

    DOM.createElement(this.root, this.template)

    document.querySelector('.header__close').addEventListener('click', () => new MainMenu(this.root))
  }
}