// src/pages/Trips.jsx (atualizado)
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { get } from '../services/api'
import Loader from '../components/Loader'

const PageTitle = styled.h2`margin:0 0 14px 0;`
const CardGrid = styled.div`display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:18px;`
const Card = styled.div`background:white; border-radius:12px; box-shadow:0 6px 20px rgba(12,40,80,0.08); overflow:hidden;`
const CardImg = styled.div`height:140px; background-size:cover; background-position:center;`
const CardBody = styled.div`padding:14px;`
const Title = styled.h3`margin:0 0 8px 0; font-size:16px;`
const Muted = styled.p`margin:0; font-size:13px; color:#5b6b79;`
const Badge = styled.span`background:#f0f8ff;color:#055a8c;padding:6px 8px;border-radius:8px;font-weight:700;font-size:12px;`

export default function Trips(){
  const [trips, setTrips] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const destinationFilter = searchParams.get('destination')

  useEffect(()=> {
    let mounted = true
    const url = destinationFilter ? `/api/trips?destination=${destinationFilter}` : '/api/trips'
    get(url)
      .then(data => { if (mounted) setTrips(data) })
      .catch(err => { if (mounted) setError(err.message) })
    return () => mounted = false
  }, [destinationFilter])

  if(error) return <Muted>Erro: {error}</Muted>
  if(!trips) return <CardGrid>{[1,2,3].map(i => <Card key={i}><Loader /></Card>)}</CardGrid>

  return (
    <div>
      <PageTitle>{destinationFilter ? 'Trips deste destino' : 'Trips disponíveis'}</PageTitle>

      {destinationFilter && (
        <Muted style={{marginTop:6}}>
          Mostrando saídas apenas para o destino selecionado. <Link to="/destinations">Ver todos os destinos</Link>
        </Muted>
      )}

      <CardGrid style={{marginTop:12}}>
        {trips.map(trip => {
          const img = trip.destination?.imageUrl || `https://picsum.photos/seed/trip-${trip.id}/600/400`
          const title = trip.location || trip.destination?.name || 'Destino'
          const subtitle = trip.destination?.name ? `${trip.destination.name} • ${trip.destination.city}` : (trip.destination?.city || '')

          return (
            <Card key={trip.id}>
              <CardImg style={{ backgroundImage:`url(${img})` }} />
              <CardBody>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <Title>{title}</Title>
                  <Badge>R$ {trip.price?.toFixed(2)}</Badge>
                </div>

                <Muted>{subtitle} • {trip.startDate} → {trip.endDate}</Muted>

                <div style={{height:8}} />

                <div style={{display:'flex', gap:10}}>
                  <button onClick={() => navigate(`/book/${trip.id}`)}>
                    Reservar • R$ {trip.price?.toFixed(2)}
                  </button>
                  <Link to={`/trips/${trip.id}`}>Detalhes</Link>

                  <div style={{marginLeft:'auto', fontSize:12, color:'#5b6b79'}}>Vagas: {trip.seats}</div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </CardGrid>
    </div>
  )
}
