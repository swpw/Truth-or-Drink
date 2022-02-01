import { MainMenu } from './DOM.js'

window.onload = () => {
  const root = document.querySelector('#root')

  new MainMenu(root)
}