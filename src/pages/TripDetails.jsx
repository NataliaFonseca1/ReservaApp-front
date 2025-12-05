// src/pages/TripDetails.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { get } from '../services/api'
import Loader from '../components/Loader'

const PageTitle = styled.h2`margin:0 0 14px 0;`
const Card = styled.div`background:white; border-radius:12px; box-shadow:0 6px 20px rgba(12,40,80,0.08); overflow:hidden;`
const Hero = styled.div`display:flex; gap:18px; flex-wrap:wrap;`
const HeroMain = styled.div`flex:1; min-width:300px;`
const HeroImg = styled.div`height:340px; border-radius:10px; background-size:cover; background-position:center;`
const Side = styled.aside`width:320px; min-width:260px;`
const SmallGallery = styled.div`display:flex; gap:8px; margin-top:10px;`
const SmallImg = styled.div`flex:1; height:76px; border-radius:8px; background-size:cover; background-position:center;`
const Title = styled.h3`margin:0 0 8px 0;`
const Muted = styled.p`margin:0; font-size:14px; color:#5b6b79;`
const Row = styled.div`display:flex; gap:12px; margin-top:12px; flex-wrap:wrap; align-items:center;`
const Badge = styled.span`background:#f0f8ff; color:#055a8c; padding:6px 8px; border-radius:8px; font-weight:700; font-size:12px;`

function chooseFallbackImage({ tripId, destId }) {
  const seed = destId ? `dest-${destId}` : `trip-${tripId}`
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/500`
}

export default function TripDetails(){
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState(null)

  useEffect(()=> {
    let mounted = true
    get(`/api/trips/${id}`)
      .then(d => { if(mounted) setTrip(d) })
      .catch(e => { if(mounted) setError(e.message || String(e)) })
    return () => mounted = false
  }, [id])

  if (error) return <Muted>Erro: {error}</Muted>
  if (!trip) return <Loader />

  const destination = trip.destination || {}
  const mainImage = trip.imageUrl || destination.imageUrl || chooseFallbackImage({ tripId: trip.id, destId: destination.id })
  const gallery = [
    destination.imageUrl,
    `https://picsum.photos/seed/dest-${destination.id || trip.id}/400/250`,
    `https://picsum.photos/seed/trip-${trip.id}/400/250`
  ].filter(Boolean)

  return (
    <div>
      <PageTitle>Detalhes da trip</PageTitle>

      <Card style={{padding:16}}>
        <Hero>
          <HeroMain>
            <HeroImg style={{backgroundImage:`url(${mainImage})`}} />

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginTop:12}}>
              <div>
                <h2 style={{margin:'6px 0 4px'}}>{destination.name || 'Destino desconhecido'}</h2>
                <Muted>{destination.city || '—'} • {destination.country || '—'}</Muted>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:18, fontWeight:800}}>R$ {trip.price?.toFixed(2)}</div>
                <div style={{fontSize:12, color:'#5b6b79'}}>Vagas: {trip.seats}</div>
              </div>
            </div>

            <section style={{marginTop:16}}>
              <h4 style={{margin:'8px 0'}}>Sobre a viagem</h4>
              <p style={{marginTop:6, color:'#334e68', lineHeight:1.6}}>
                {trip.description || `Saída: ${trip.startDate}. Retorno: ${trip.endDate}. Esta trip oferece ${trip.seats} vagas e tem preço de R$ ${trip.price?.toFixed(2)} por pessoa.`}
              </p>
            </section>

            <section style={{marginTop:16}}>
              <h4 style={{margin:'8px 0'}}>Sobre o destino</h4>
              <p style={{marginTop:6, color:'#334e68', lineHeight:1.6}}>
                {destination.description || 'Descrição do destino não cadastrada.'}
              </p>
            </section>
          </HeroMain>

          <Side>
            <div style={{fontWeight:800, fontSize:16, marginBottom:8}}>
              {destination.city || '-'}, {destination.country || '-'}
            </div>
            <div style={{color:'#334e68', fontSize:13}}>Preço base do destino: R$ {destination.basePrice ? destination.basePrice.toFixed(2) : '—'}</div>

            <SmallGallery>
              {gallery.map((src, i) => (
                <SmallImg key={i} style={{backgroundImage:`url(${src})`}} />
              ))}
            </SmallGallery>

            <Row style={{marginTop:14, justifyContent:'flex-start'}}>
              <Link to={`/book/${trip.id}`} style={{textDecoration:'none'}}>
                <button>Reservar agora • R$ {trip.price?.toFixed(2)}</button>
              </Link>
              <Link to="/trips" style={{textDecoration:'none'}}>
                <button style={{background:'transparent', color:'#0b2545', border:'1px solid #e6eef6'}}>Voltar</button>
              </Link>
            </Row>
          </Side>
        </Hero>
      </Card>
    </div>
  )
}
