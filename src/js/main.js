class DOM{
  constructor(root, questions){
    this.root = root
    this.questions = questions
  }

  static createElement = (insertTO, template) => {
    const el = document.createElement('div')
    insertTO.appendChild(el)
    el.outerHTML = template
  }

  static clearElements = insertTO => insertTO.innerHTML = ''
}

class MainMenu extends DOM{
  constructor(root, questions){
    super(root, questions)

    if(questions === undefined){
      fetchQuestions().then(res => {
        this.questions = res
      })
    }

    this.template = `<section class="mainMenu">
    <div class="mainMenu__imageContainer"></div>
    <section class="mainMenu__sectionContent">
      <section class="mainMenu__sectionTop">
        <h1 class="mainMenu__title">Truth or Drink</h1>
        <p class="mainMenu__paragraphCatchphrase">Answer the question, or<br> take a drink</p>
        <p class="mainMenu__paragraphDescription">By the end of the night, we’ll all be better friends after asking the questions we’ve never dared to ask out loud. If anything, it’s worth a shot. </p>
      </section>
      <section class="mainMenu__sectionBot">
        <button id="btn-playWithFriends" class="mainMenu__button">Play with friends</button>
        <button id="btn-randomQuestions" class="mainMenu__button">Random questions</button>
      </section>
    </section>
    </section>`

    DOM.clearElements(this.root)
    DOM.createElement(this.root, this.template)

    document.querySelector('#btn-playWithFriends').addEventListener('click', () => new PlayWithFriends(this.root, this.questions))

    document.querySelector('#btn-randomQuestions').addEventListener('click', () => new RandomQuestions(this.root, this.questions))
  }
}

class PlayWithFriends extends DOM{
  constructor(root, questions){
    super(root, questions)
    console.log('PlayWithFriends', this.questions)
  }
}

class RandomQuestions extends DOM{
  constructor(root, questions){
    super(root, questions)
    this.history = []

    this.template = (questions) => {
      const getQuestion = new Questions().nextQuestion(questions)

      this.history.push(getQuestion)

      return `<section class="randomQuestions">
      <section class="randomQuestions__content randomQuestions__content--${getQuestion.randomDificultyKey}">
        <h2 class="randomQuestions__title randomQuestions__title--${getQuestion.randomDificultyKey}">${getQuestion.randomDificultyKey} #${getQuestion.randomQuestion.id}</h2>
        <p class="randomQuestions__description">${getQuestion.randomQuestion.en}</</p>
      </section>
      <div class="randomQuestions__icon doubleTap">
        <div class="doubleTap__icon"></div>
        <p class="doubleTap__text">Double tap <br>to next question</p>
      </div>
    </section>`
    }
    
    DOM.clearElements(this.root)
    DOM.createElement(this.root, this.template(this.questions))
    new Header(this.root)

    document.querySelector('.randomQuestions').addEventListener('dblclick', () => {
      if(Object.keys(this.questions).length === 0){
        new EndOfQuestions(this.root)
      }else{
        const contentRoot = document.querySelector('.randomQuestions__content')

        document.querySelector('.randomQuestions').innerHTML = ''
        DOM.createElement(document.querySelector('.randomQuestions'), this.template(this.questions))
      }
    })
  }
}

class Header extends DOM{
  constructor(root){
    super(root)
    
    this.template = `<header class="header">
      <img class="header__close" src="./assets/close.svg" alt="close">
      <h1 class="header__logo">Truth or Drink</h1>
      <img class="header__info" src="./assets/info.svg" alt="info">
    </header>`

    DOM.createElement(this.root, this.template)

    document.querySelector('.header__close').addEventListener('click', () => new MainMenu(this.root))

    document.querySelector('.header__info').addEventListener('click', () => new Info(this.root))
  }
}

class EndOfQuestions extends DOM{
  constructor(root){
    super(root)
    
    this.template = `<section class="randomQuestions">
      <section class="randomQuestions__content">
        <h2 class="randomQuestions__End-title">The End of The Questions</h2>
        <p class="randomQuestions__End-description">Thank you for playing.</p>
      </section>
      <div class="randomQuestions__icon doubleTap">
        <div class="doubleTap__icon"></div>
        <p class="doubleTap__text">Double tap <br>to next question</p>
      </div>
    </section>`

    DOM.clearElements(this.root)
    DOM.createElement(this.root, this.template)
    DOM.createElement(this.root, new Header(this.root))

    document.querySelector('.randomQuestions').addEventListener('dblclick', () => {
      new MainMenu(this.root)
    })
  }
}

class Info extends DOM{
  constructor(root){
    super(root)
    
    console.log('info')
  }
}

class Questions{
  nextQuestion = (questions) => {
    const rand = maxNumber => Math.floor(Math.floor(maxNumber) * Math.random())

    const lengthOfCategories = Object.keys(questions).length

    // Remove random question vars
    const randomDificultyKey = Object.keys(questions)[rand(lengthOfCategories)]
    const randomDificultyQuestions = questions[randomDificultyKey]
    const length = randomDificultyQuestions.length
    const randomQuestion = randomDificultyQuestions[rand(length)]

    // Remove random question
    questions[randomDificultyKey] = questions[randomDificultyKey].filter(e => e.id !== randomQuestion.id)
  
    //Remove category if it's empty
    for(const key in questions){
      if(questions[key].length === 0) delete questions[key]
    }

    return { randomDificultyKey, randomQuestion }
  }
}

const fetchQuestions = async () => {
  let res = await fetch('./assets/questions.json')
  res = await res.json()

  return res
}

window.onload = () => {
  const root = document.querySelector('#root')

  new MainMenu(root)
}