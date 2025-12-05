// src/pages/MyBookings.jsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { get } from '../services/api'
import Loader from '../components/Loader'

const PageTitle = styled.h2`margin:0 0 14px 0;`
const Muted = styled.p`color:#5b6b79;`
const Grid = styled.div`display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:12px;`
const Card = styled.div`background:white; padding:12px; border-radius:10px; box-shadow:0 6px 20px rgba(12,40,80,0.06);`
const Row = styled.div`display:flex; gap:8px; align-items:center;`
const Input = styled.input`padding:8px 10px; border-radius:8px; border:1px solid #e6eef6;`

export default function MyBookings(){
  const [bookings, setBookings] = useState(null)
  const [q, setQ] = useState('')
  const [error, setError] = useState(null)

  useEffect(()=> {
    let mounted = true
    get('/api/bookings').then(d => { if(mounted) setBookings(d) }).catch(e=>{ if(mounted) setError(e.message) })
    return ()=> mounted=false
  },[])

  const filtered = (bookings || []).filter(b => {
    if(!q) return true
    const ql = q.toLowerCase()
    return (b.clientEmail || '').toLowerCase().includes(ql) || (b.clientName || '').toLowerCase().includes(ql)
  })

  return (
    <div>
      <PageTitle>Minhas reservas</PageTitle>
      <Row style={{marginBottom:12}}>
        <Input placeholder="Filtrar por e-mail ou nome" value={q} onChange={e=>setQ(e.target.value)} />
        <Muted style={{marginLeft:10}}>Mostrando {filtered.length}/{bookings?.length || 0}</Muted>
      </Row>

      {error && <Muted>Erro: {error}</Muted>}
      {!bookings && <Grid>{[1,2,3].map(i=><Card key={i}><Loader/></Card>)}</Grid>}

      {bookings && (
        <Grid>
          {filtered.map(b => (
            <Card key={b.id}>
              <h4 style={{margin:'0 0 6px 0'}}>{b.clientName || '—'}</h4>
              <Muted>{b.clientEmail}</Muted>
              <div style={{height:8}}/>
              <div style={{fontSize:13, color:'#334e68'}}><strong>Trip:</strong> {b.trip?.destination?.name || '—'}</div>
              <div style={{fontSize:13, color:'#334e68'}}><strong>Vagas:</strong> {b.people}</div>
              <div style={{fontSize:13, color:'#334e68'}}><strong>Valor:</strong> R$ {b.totalPrice?.toFixed(2)}</div>
              <div style={{height:8}}/>
              <div style={{fontSize:12, color:'#5b6b79'}}><strong>Status:</strong> {b.status}</div>
              <div style={{height:6}}/>
              <div style={{fontSize:12, color:'#99a7b6'}}>Criado: {new Date(b.createdAt).toLocaleString()}</div>
            </Card>
          ))}
        </Grid>
      )}
    </div>
  )
}
