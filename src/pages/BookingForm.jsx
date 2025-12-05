// src/pages/BookingForm.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { get, post } from '../services/api'
import Loader from '../components/Loader'
import Modal from '../components/Modal'

const PageTitle = styled.h2`margin:0 0 14px 0;`
const Card = styled.div`background:white; border-radius:12px; box-shadow:0 6px 20px rgba(12,40,80,0.08); overflow:hidden;`
const CardBody = styled.div`padding:14px;`

export default function BookingForm(){
  const { id } = useParams()
  const nav = useNavigate()
  const [trip, setTrip] = useState(null)
  const [form, setForm] = useState({ clientName:'', clientEmail:'', people:1 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [confirmationInfo, setConfirmationInfo] = useState(null)

  useEffect(()=>{ 
    let mounted=true
    get(`/api/trips/${id}`).then(d=>{ if(mounted) setTrip(d) }).catch(e=>setError(e.message))
    return ()=> mounted=false
  },[id])

  async function submit(e){
    e.preventDefault(); setLoading(true); setError(null)
    try{
      // garanta que a url não fique com // duplicado
      await post(`/api/bookings/trip/${id}`, form)
      setConfirmationInfo({ tripName: trip?.destination?.name, price: trip?.price, people: form.people })
      setShowModal(true)
      // redireciona após 1.6s (ou quando fechar)
      setTimeout(()=>{ setShowModal(false); nav('/') }, 1600)
    }catch(err){ setError(err.message) }
    setLoading(false)
  }

  if(error) return <div>Erro: {error}</div>
  if(!trip) return <Loader />

  return (
    <div>
      <PageTitle>Reservar: {trip.destination?.name}</PageTitle>
      <Card>
        <CardBody>
          <form onSubmit={submit}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <label>
                <div style={{fontWeight:700,marginBottom:6}}>Nome</div>
                <input required value={form.clientName} onChange={e=>setForm({...form, clientName:e.target.value})} style={{padding:10,borderRadius:8,border:'1px solid #e6eef6',width:'100%'}} />
              </label>
              <label>
                <div style={{fontWeight:700,marginBottom:6}}>E-mail</div>
                <input type="email" required value={form.clientEmail} onChange={e=>setForm({...form, clientEmail:e.target.value})} style={{padding:10,borderRadius:8,border:'1px solid #e6eef6',width:'100%'}} />
              </label>
            </div>
            <div style={{height:8}}/>
            <label>
              <div style={{fontWeight:700,marginBottom:6}}>Pessoas</div>
              <input type="number" min={1} value={form.people} onChange={e=>setForm({...form, people:Number(e.target.value)})} style={{padding:10,borderRadius:8,border:'1px solid #e6eef6',width:120}} />
            </label>
            <div style={{height:14}} />
            <div style={{display:'flex',gap:12}}>
              <button type="submit" disabled={loading}>{loading ? 'Enviando...' : `Confirmar • R$ ${(trip.price*form.people).toFixed(2)}`}</button>
              <button type="button" onClick={()=>nav('/trips')}>Cancelar</button>
            </div>
          </form>
          {error && <p style={{color:'crimson',marginTop:10}}>Erro: {error}</p>}
        </CardBody>
      </Card>

      <Modal
        open={showModal}
        title="Reserva enviada!"
        primaryLabel="Ir para Início"
        onPrimary={()=> { setShowModal(false); nav('/') }}
      >
        <div>
          <p style={{marginTop:0}}>Sua reserva para <strong>{confirmationInfo?.tripName}</strong> foi enviada com sucesso.</p>
          <p style={{margin:0}}>Total: R$ { (confirmationInfo?.price * confirmationInfo?.people || 0).toFixed(2) }</p>
        </div>
      </Modal>
    </div>
  )
}
