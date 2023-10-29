import Ticket from './Ticket/Ticket'
import AddForm from './add_item_form/AddChangeItem'
import ConfirmFrom from './comfirmForm/comfirmForm'

export default class DomControl {
  constructor () {
    this.tickets = []
    this.board = document.querySelector('.board')
    this.addForm = new AddForm()
    this.confirmForm = new ConfirmFrom()
    this.url = 'https://ahj-server.onrender.com' // 'http://192.168.31.190:7070'

    document.querySelector('.board__add').addEventListener('click', this.onAdd)
  }

  init () {
    this.getTickets()
  }

  async getTickets () {
    return await fetch(this.url + '?method=allTickets')
      .then(resp => resp.json())
      .then(res => {
        this.clear()
        this.tickets = []
        res.forEach(element => {
          const ticket = new Ticket(element.id, element.name, element.created, element.status)
          this.tickets.push(ticket)
        })
        return this.tickets
      })
      .then(() => this.tickets.forEach(el => el.dom(this.board)))
      .then(() => this.listener())
  }

  async clear () {
    this.tickets.forEach(el => el.remove())
    if (this.board.children.length > 0) {
      [...this.board.children].forEach(el => el.remove())
    }
  }

  async listener () {
    document.querySelectorAll('.task__status').forEach(el => el.addEventListener('change', this.onChecked))
    document.querySelectorAll('.task__redact').forEach(el => el.addEventListener('click', this.onRedact))
    document.querySelectorAll('.task__del').forEach(el => el.addEventListener('click', this.onDelete))
    document.querySelectorAll('.board__task').forEach(el => el.addEventListener('click', this.onDetail))
  }

  onChecked = (event) => {
    const ticketId = event.target.closest('.board__task').dataset.id
    const ticked = this.tickets.find(el => el.id === ticketId)
    ticked.status = event.target.checked
    fetch(this.url + '?method=changeStatus', { method: 'PATCH', body: JSON.stringify(ticked) })
  }

  onRedact = (event) => {
    const ticketId = event.target.closest('.board__task').dataset.id
    const ticket = this.tickets.find(el => el.id === ticketId)
    this.addForm.createItemForm(this.getTickets.bind(this), true, ticket)
  }

  onDelete = (event) => {
    const ticketId = event.target.closest('.board__task').dataset.id
    const ticket = this.tickets.find(el => el.id === ticketId)
    this.confirmForm.createForm(this.delete.bind(this), ticket)
  }

  delete (ticket) {
    this.tickets = this.tickets.filter(el => el !== ticket)
    ticket.remove()
    fetch(this.url + `?method=deleteTicket&id=${ticket.id}`, { method: 'DELETE' })
  }

  onDetail = (event) => {
    const target = event.target.classList.value
    if (['task__status', 'task__redact', 'task__del'].includes(target)) {
      return
    }
    const ticketId = event.target.closest('.board__task').dataset.id
    const ticket = this.tickets.find(el => el.id === ticketId)
    if (ticket.descriptionShow) {
      ticket.descriptionShow.remove()
      ticket.descriptionShow = false
      return
    }

    fetch(this.url + `?method=ticketById&id=${ticket.id}`)
      .then((resp) => resp.json())
      .then((res) => {
        const detail = this.showDetail(res.description)
        ticket.task.insertAdjacentElement('afterend', detail)
        ticket.descriptionShow = detail
      })
  }

  onAdd = () => {
    this.addForm.createItemForm(this.getTickets.bind(this))
  }

  showDetail (description) {
    const detail = document.createElement('div')
    detail.classList.add('task__detail')

    const text = document.createElement('span')
    text.innerText = description

    detail.append(text)
    return detail
  }
}
