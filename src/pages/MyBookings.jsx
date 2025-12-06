// src/pages/MyBookings.jsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { get, del, put } from '../services/api'
import Loader from '../components/Loader'
import Modal from '../components/Modal'

const PageTitle = styled.h2`margin:0 0 14px 0;`
const Muted = styled.p`color:#5b6b79;`
const Grid = styled.div`
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap:12px;
`
const Card = styled.div`
  background:white;
  padding:12px;
  border-radius:10px;
  box-shadow:0 6px 20px rgba(12,40,80,0.06);
`
const Row = styled.div`display:flex; gap:8px; align-items:center;`
const Input = styled.input`
  padding:8px 10px;
  border-radius:8px;
  border:1px solid #e6eef6;
`
const ActionsRow = styled.div`
  display:flex;
  gap:8px;
  margin-top:8px;
`

const SmallButton = styled.button`
  padding:6px 10px;
  font-size:12px;
  border-radius:8px;
  border:none;
  cursor:pointer;
`

const DangerButton = styled(SmallButton)`
  background:#d64545;
  color:white;
`

const OutlineButton = styled(SmallButton)`
  background:white;
  border:1px solid #cbd2e1;
  color:#243b53;
`

// ===== helpers de data =====

// usa a string como vem do backend ("2026-03-26" ou "2026-03-26T00:00:00")
// e pega só os 10 primeiros caracteres
function formatDateForInput(iso){
  if (!iso) return ''
  return iso.toString().slice(0, 10)   // "2026-03-26"
}

// formata para exibição no card: DD/MM/YYYY
function formatDisplayDate(iso) {
  if (!iso) return '—'
  const s = iso.toString().slice(0, 10) // "2026-03-26"
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`               // "26/03/2026"
}

export default function MyBookings(){
  const [bookings, setBookings] = useState(null)
  const [q, setQ] = useState('')
  const [error, setError] = useState(null)

  const [deletingId, setDeletingId] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState(null)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [bookingToEdit, setBookingToEdit] = useState(null)
  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  const nav = useNavigate()

  useEffect(()=> {
    let mounted = true
    get('/api/bookings')
      .then(d => { if(mounted) setBookings(d) })
      .catch(e=>{ if(mounted) setError(e.message) })
    return ()=> mounted=false
  },[])

  const filtered = (bookings || []).filter(b => {
    if(!q) return true
    const ql = q.toLowerCase()
    return (b.clientEmail || '').toLowerCase().includes(ql) ||
           (b.clientName || '').toLowerCase().includes(ql)
  })

  // ========= EXCLUSÃO =========

  function openDeleteModal(booking){
    setBookingToDelete(booking)
    setDeleteModalOpen(true)
  }

  function closeDeleteModal(){
    setDeleteModalOpen(false)
    setBookingToDelete(null)
    setDeletingId(null)
  }

  async function confirmDelete(){
    if(!bookingToDelete) return
    try{
      setDeletingId(bookingToDelete.id)
      await del(`/api/bookings/${bookingToDelete.id}`)
      setBookings(prev => prev.filter(b => b.id !== bookingToDelete.id))
      closeDeleteModal()
    }catch(err){
      alert('Erro ao excluir: ' + err.message)
      setDeletingId(null)
    }
  }

  // ========= EDIÇÃO (datas da viagem) =========

  function openEditModal(booking){
    setBookingToEdit(booking)
    setEditStartDate(formatDateForInput(booking.trip?.startDate))
    setEditEndDate(formatDateForInput(booking.trip?.endDate))
    setEditModalOpen(true)
  }

  function closeEditModal(){
    setEditModalOpen(false)
    setBookingToEdit(null)
    setSavingEdit(false)
  }

  async function saveEdit() {
    if (!bookingToEdit || !bookingToEdit.trip) return
    try {
      setSavingEdit(true)

      // manda pro backend só "YYYY-MM-DD" (sem timezone)
      const updatedTrip = {
        ...bookingToEdit.trip,
        startDate: editStartDate,
        endDate: editEndDate
      }

      await put(`/api/trips/${bookingToEdit.trip.id}`, updatedTrip)

      // atualiza a lista em memória
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingToEdit.id
            ? {
                ...b,
                trip: {
                  ...b.trip,
                  startDate: editStartDate,
                  endDate: editEndDate
                }
              }
            : b
        )
      )

      closeEditModal()
    } catch (err) {
      alert('Erro ao salvar alterações: ' + err.message)
      setSavingEdit(false)
    }
  }

  return (
    <div>
      <PageTitle>Minhas reservas</PageTitle>
      <Row style={{marginBottom:12}}>
        <Input
          placeholder="Filtrar por e-mail ou nome"
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        <Muted style={{marginLeft:10}}>
          Mostrando {filtered.length}/{bookings?.length || 0}
        </Muted>
      </Row>

      {error && <Muted>Erro: {error}</Muted>}

      {!bookings && (
        <Grid>
          {[1,2,3].map(i => (
            <Card key={i}>
              <Loader/>
            </Card>
          ))}
        </Grid>
      )}

      {bookings && (
        <Grid>
          {filtered.map(b => (
            <Card key={b.id}>
              <h4 style={{margin:'0 0 6px 0'}}>{b.clientName || '—'}</h4>
              <Muted>{b.clientEmail}</Muted>
              <div style={{height:8}}/>
              <div style={{fontSize:13, color:'#334e68'}}>
                <strong>Trip:</strong> {b.trip?.destination?.name || '—'}
              </div>
              <div style={{fontSize:13, color:'#334e68'}}>
                <strong>Pessoas:</strong> {b.people}</div>
              <div style={{fontSize:13, color:'#334e68'}}>
                <strong>Valor:</strong> R$ {b.totalPrice?.toFixed(2)}
              </div>
              <div style={{fontSize:13, color:'#334e68'}}>
                <strong>Data ida:</strong>{' '}
                {formatDisplayDate(b.trip?.startDate)}
              </div>
              <div style={{fontSize:13, color:'#334e68'}}>
                <strong>Data volta:</strong>{' '}
                {formatDisplayDate(b.trip?.endDate)}
              </div>
              <div style={{height:8}}/>
              <div style={{fontSize:12, color:'#5b6b79'}}>
                <strong>Status:</strong> {b.status}
              </div>
              <div style={{height:6}}/>
              <div style={{fontSize:12, color:'#99a7b6'}}>
                Criado:{' '}
                {b.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}
              </div>

              <ActionsRow>
                <OutlineButton onClick={() => openEditModal(b)}>
                  Editar datas
                </OutlineButton>
                <DangerButton
                  onClick={() => openDeleteModal(b)}
                  disabled={deletingId === b.id}
                >
                  {deletingId === b.id ? 'Excluindo...' : 'Excluir'}
                </DangerButton>
              </ActionsRow>
            </Card>
          ))}
        </Grid>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Modal
        open={deleteModalOpen}
        title="Excluir reserva"
        primaryLabel="Fechar"
        onPrimary={closeDeleteModal}
      >
        <div>
          <p>
            Tem certeza que deseja excluir a reserva de{' '}
            <strong>{bookingToDelete?.clientName}</strong>?
          </p>
          <p style={{fontSize:13, color:'#5b6b79'}}>
            Esta ação não poderá ser desfeita.
          </p>
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button onClick={closeDeleteModal}>Cancelar</button>
            <button
              onClick={confirmDelete}
              disabled={!!deletingId}
              style={{background:'#d64545', color:'#fff', border:'none', borderRadius:8, padding:'6px 12px'}}
            >
              {deletingId ? 'Excluindo...' : 'Confirmar exclusão'}
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE EDIÇÃO DE DATAS */}
      <Modal
        open={editModalOpen}
        title="Editar datas da viagem"
        primaryLabel="Fechar"
        onPrimary={closeEditModal}
      >
        {bookingToEdit && (
          <div>
            <p style={{marginTop:0}}>
              Reserva de <strong>{bookingToEdit.clientName}</strong> para{' '}
              <strong>{bookingToEdit.trip?.destination?.name}</strong>.
            </p>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
              <label>
                <div style={{fontWeight:600, marginBottom:4}}>Data de ida</div>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={e => setEditStartDate(e.target.value)}
                  style={{padding:8, borderRadius:8, border:'1px solid #e6eef6', width:'100%'}}
                />
              </label>
              <label>
                <div style={{fontWeight:600, marginBottom:4}}>Data de volta</div>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={e => setEditEndDate(e.target.value)}
                  style={{padding:8, borderRadius:8, border:'1px solid #e6eef6', width:'100%'}}
                />
              </label>
            </div>

            <div style={{marginTop:14, display:'flex', justifyContent:'flex-end', gap:8}}>
              <button onClick={closeEditModal}>Cancelar</button>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                style={{background:'#0b7285', color:'#fff', border:'none', borderRadius:8, padding:'6px 12px'}}
              >
                {savingEdit ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
