export default class Ticket {
  constructor (id, name, created, status) {
    this.id = id
    this.name = name
    this.created = created
    this.status = status
    this.task = null
    this.descriptionShow = false
  }

  dom (elementDom) {
    const task = document.createElement('div')
    task.classList.add('board__task')
    task.dataset.id = this.id

    const status = document.createElement('input')
    status.type = 'checkbox'
    status.classList.add('task__status')
    status.checked = this.status

    const title = document.createElement('span')
    title.classList.add('task__title')
    title.innerText = this.name

    const created = document.createElement('span')
    created.classList.add('task__created')
    created.innerText = new Date(this.created).toLocaleString()

    const control = document.createElement('div')
    control.classList.add('task__control')

    const redact = document.createElement('button')
    redact.classList.add('task__redact')
    redact.innerText = '✎'

    const del = document.createElement('button')
    del.classList.add('task__del')
    del.innerText = '✖'

    control.append(redact, del)
    task.append(status, title, created, control)
    this.task = task
    elementDom.appendChild(task)
  }

  remove () {
    this.task.remove()
  }
}
