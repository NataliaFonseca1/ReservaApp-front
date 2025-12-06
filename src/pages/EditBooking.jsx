import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { get, put } from '../services/api'

export default function EditBooking(){
  const { id } = useParams()
  const nav = useNavigate()

  const [booking, setBooking] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    get(`/api/bookings/${id}`)
      .then(setBooking)
      .catch(e => setError(e.message))
  }, [id])

  function submit(e){
    e.preventDefault()
    put(`/api/bookings/${id}`, booking)
      .then(() => nav('/my-bookings'))
      .catch(err => setError(err.message))
  }

  if(!booking) return <div>Carregando...</div>

  return (
    <form onSubmit={submit}>
      <h2>Editar Reserva</h2>

      <label>Nome:</label>
      <input value={booking.clientName} onChange={e=> setBooking({...booking, clientName:e.target.value})} />

      <label>Email:</label>
      <input value={booking.clientEmail} onChange={e=> setBooking({...booking, clientEmail:e.target.value})} />

      <label>Pessoas:</label>
      <input type="number" value={booking.people} onChange={e=> setBooking({...booking, people: Number(e.target.value)})} />

      <label>Status:</label>
      <select value={booking.status} onChange={e=> setBooking({...booking, status:e.target.value})}>
        <option value="PENDING">Pendente</option>
        <option value="CONFIRMED">Confirmado</option>
        <option value="CANCELLED">Cancelado</option>
      </select>

      <button type="submit">Salvar</button>
    </form>
  )
}
