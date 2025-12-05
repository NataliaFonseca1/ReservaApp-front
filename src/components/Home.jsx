// src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { get } from '../services/api'
import Loader from '../components/Loader'

const Hero = styled.section`
  background: linear-gradient(180deg,#ffffff 0%,#f3fbff 100%);
  border-radius:14px;
  padding:28px;
  display:flex;
  gap:24px;
  align-items:center;
  margin-bottom:20px;
  box-shadow: 0 8px 30px rgba(12,40,80,0.06);
`
const HeroText = styled.div`flex:1;`
const HeroTitle = styled.h1`margin:0 0 10px 0; font-size:28px; color:#05263a;`
const HeroSub = styled.p`margin:0; color:#38556b;`
const HeroActions = styled.div`margin-top:16px; display:flex; gap:12px;`
const CTA = styled(Link)`
  background: linear-gradient(90deg,#0070f3,#00c2ff);
  color:white; padding:10px 14px; border-radius:10px; text-decoration:none; font-weight:800;
  box-shadow: 0 8px 18px rgba(0,112,243,0.12);
`
const Secondary = styled(Link)`
  padding:10px 14px; border-radius:10px; text-decoration:none; color:#0b2545; background:transparent; font-weight:700;
  border:1px solid rgba(11,37,69,0.06);
`
const HeroImage = styled.div`
  width:320px; height:160px; border-radius:8px; background-size:cover; background-position:center;
  box-shadow: 0 6px 24px rgba(12,40,80,0.06);
`

const FadeIn = keyframes`from{opacity:0; transform:translateY(6px)}to{opacity:1; transform:none}`

const Section = styled.section`animation:${FadeIn} 420ms ease; margin-bottom:18px;`

const Grid = styled.div`
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap:14px;
`

const Card = styled.div`
  background:white; padding:12px; border-radius:10px; box-shadow:0 6px 18px rgba(12,40,80,0.06);
`
const CardImg = styled.div`height:120px; border-radius:8px; background-size:cover; background-position:center;`
const Title = styled.h4`margin:8px 0 6px 0;`
const Muted = styled.p`margin:0; color:#5b6b79; font-size:13px;`

export default function Home(){
  const [trips, setTrips] = useState(null)
  const [error, setError] = useState(null)

  useEffect(()=> {
    let mounted = true
    get('/api/trips').then(d=>{ if(mounted) setTrips(d.slice(0,6)) }).catch(e=>{ if(mounted) setError(e.message) })
    return ()=> mounted=false
  },[])

  return (
    <div>
      <Hero>
        <HeroText>
          <HeroTitle>Descubra sua próxima aventura</HeroTitle>
          <HeroSub>Encontre viagens com preços justos, reserve em poucos cliques e aproveite experiências inesquecíveis.</HeroSub>
          <HeroActions>
            <CTA to="/trips">Explorar trips</CTA>
            <Secondary to="/destinations">Ver destinos</Secondary>
            <Secondary to="/my-bookings">Minhas reservas</Secondary>
          </HeroActions>
        </HeroText>
        <HeroImage style={{backgroundImage:'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60)'}}/>
      </Hero>

      <Section>
        <h3 style={{marginTop:0}}>Destaques</h3>
        {error && <Muted>Erro ao carregar: {error}</Muted>}
        {!trips && <Grid>{[1,2,3].map(i=><Card key={i}><Loader/></Card>)}</Grid>}
        {trips && (
          <Grid>
            {trips.map(t => (
              <Card key={t.id}>
                <CardImg style={{backgroundImage:`url(${t.destination?.imageUrl || ('https://picsum.photos/600/400?random=' + t.id)})`}}/>
                <Title>{t.destination?.name}</Title>
                <Muted>{t.startDate} → {t.endDate} • R$ {t.price?.toFixed(2)}</Muted>
                <div style={{height:8}}/>
                <div style={{display:'flex', gap:8}}>
                  <CTA to={`/book/${t.id}`} style={{padding:'8px 10px', fontSize:14}}>Reservar</CTA>
                  <Secondary to={`/trips/${t.id}`}>Detalhes</Secondary>
                </div>
              </Card>
            ))}
          </Grid>
        )}
      </Section>
    </div>
  )
}
