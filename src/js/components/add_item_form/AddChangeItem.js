export default class AddForm {
  constructor () {
    this.addform = null
    this.inputTittle = null
    this.inputDescription = null
    this.successMassage = null
    this.url = 'https://ahj-server.onrender.com'// 'http://192.168.31.190:7070'
  }

  createItemForm (callback, change = false, ticket = {}) {
    const itemForm = document.createElement('form')
    itemForm.classList.add('board__add-form')
    // itemForm.noValidate = true
    const formName = document.createElement('h2')
    formName.innerText = 'Добавить тикет'

    const tittleItem = document.createElement('span')
    tittleItem.innerText = 'Краткое описание'
    const inputTittle = document.createElement('input')
    inputTittle.classList.add('add-form__title')
    inputTittle.name = 'title'

    inputTittle.required = true
    this.inputTittle = inputTittle

    const descriptionItem = document.createElement('span')
    descriptionItem.innerText = 'Подробное описание'
    const description = document.createElement('input')
    description.name = 'price'
    description.required = true
    description.classList.add('add-form__description')
    this.inputDescription = description

    const buttonCont = document.createElement('div')
    buttonCont.classList.add('add-form__btn-container')

    const saveButton = document.createElement('button')
    saveButton.innerText = 'Сохранить'
    saveButton.classList.add('saveButton')
    if (!change) {
      saveButton.addEventListener('click', (event) => this.onSave(event, callback, ticket))
    }
    const cancelButton = document.createElement('button')
    cancelButton.innerText = 'Отмена'
    cancelButton.classList.add('cancelButton')
    cancelButton.addEventListener('click', this.onClose)
    buttonCont.append(saveButton, cancelButton)

    itemForm.append(formName, tittleItem, inputTittle, descriptionItem, description, buttonCont)
    this.addform = itemForm
    document.documentElement.insertAdjacentElement('beforeend', itemForm)
    if (change) {
      formName.innerText = 'Изменить тикет'
      inputTittle.value = ticket.name
      fetch(this.url + `?method=ticketById&id=${ticket.id}`)
        .then((resp) => resp.json())
        .then((res) => {
          description.value = res.description
          saveButton.addEventListener('click', (event) => this.onSave(event, callback, ticket))
        })
    }
  // return itemForm
  }

  onClose = () => {
    this.addform.remove()
  }

  onSave = (event, callback, ticket = {}) => {
    event.preventDefault()
    if (this.inputTittle.value && this.inputDescription.value) {
      ticket.name = this.inputTittle.value
      ticket.description = this.inputDescription.value
      const fetchMethod = ticket.id ? 'PATCH' : 'POST'
      const ticketMethod = ticket.id ? 'updateTicket' : 'createTicket'
      const massage = ticket.id ? 'Обновлено' : 'Создано'

      fetch(this.url + '?method=' + ticketMethod, {
        method: fetchMethod,
        body: JSON.stringify(ticket)
      })
        .then(res => {
          if (res.status === 201) {
            this.addform.remove()
            this.massageSuccess(massage)
            setTimeout(() => this.successMassage.remove(), 2000)
            callback()
          }
        })
    }
  // this.addform.remove()
  }

  massageSuccess = (massage) => {
    const message = document.createElement('div')
    message.classList.add('board__add-form')

    const messageText = document.createElement('h2')
    messageText.innerText = massage

    message.append(messageText)
    this.successMassage = message
    document.documentElement.insertAdjacentElement('beforeend', message)
  }
}
