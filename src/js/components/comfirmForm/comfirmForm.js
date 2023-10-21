export default class ConfirmFrom {
  constructor () {
    this.dom = null
  }

  createForm (callback, ticket) {
    const form = document.createElement('div')
    form.classList.add('confirm-form')

    const title = document.createElement('h2')
    title.innerText = 'Удалить тикет'

    const text = document.createElement('span')
    text.innerText = 'Вы уверенны что хотите удалить тикет? Это действие необратимо !'

    const buttonCont = document.createElement('div')
    buttonCont.classList.add('confirm-form__btn-container')

    const saveButton = document.createElement('button')
    saveButton.innerText = 'OK'
    saveButton.classList.add('saveButton')

    saveButton.addEventListener('click', (event) => this.onSave(event, callback, ticket))

    const cancelButton = document.createElement('button')
    cancelButton.innerText = 'Отмена'
    cancelButton.classList.add('cancelButton')
    cancelButton.addEventListener('click', this.onClose)
    buttonCont.append(cancelButton, saveButton)

    form.append(title, text, buttonCont)

    this.dom = form

    document.documentElement.insertAdjacentElement('beforeend', form)
  }

  onClose = () => {
    this.dom.remove()
  }

  onSave = (event, callback, ticket) => {
    this.dom.remove()
    callback(ticket)
  }
}
