export default async () => {
  let data = await fetchQuestions()

  data = shuffleQuestions(data)

  return data
}

const fetchQuestions = async () => {
  let res = await fetch('./assets/questions.json')
  res = await res.json()

  return res
}

const shuffleQuestions = inputObject => {
  let array = []

  for(const key in inputObject){
    inputObject[key].map(el => el.difficulty = key)

    array = [...array, ...inputObject[key]]
  }

  // The Fisher-Yates algorith
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}