import Glide from '@glidejs/glide'

import { MainMenu } from './DOM.js'

export default (root, questions) => {
  const glide = new Glide('.glide', {
    startAt: 0,
    perView: 1,
    gap: 0,
    perTouch: 1,
    animationDuration: 500,
    rewind: false
  }).mount()

  const glideDOM = document.querySelector('.glide')
  glideDOM.addEventListener('dblclick', () => 
    glide._i === questions.length ? new MainMenu(root) : glide.go('>'))
}