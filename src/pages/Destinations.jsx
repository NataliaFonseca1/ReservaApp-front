import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { get } from '../services/api'
import Loader from '../components/Loader'

const PageTitle = styled.h2`margin:0 0 14px 0;`
const CardGrid = styled.div`display:grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap:18px;`
const Card = styled.div`background:white; border-radius:12px; box-shadow:0 6px 20px rgba(12,40,80,0.08); overflow:hidden;`
const CardImg = styled.div`height:140px; background-size:cover; background-position:center;`
const CardBody = styled.div`padding:14px;`
const Title = styled.h3`margin:0 0 8px 0; font-size:16px;`
const Muted = styled.p`margin:0; font-size:13px; color:#5b6b79;`

export default function Destinations(){
  const [destinations, setDestinations] = useState(null)
  const [error, setError] = useState(null)

  useEffect(()=>{ 
    let mounted=true
    get('/api/destinations').then(d=>{ if(mounted) setDestinations(d); }).catch(e=>{ if(mounted) setError(e.message) })
    return ()=> mounted=false
  },[])

  if(error) return <Muted>Erro ao carregar destinos: {error}</Muted>
  if(!destinations) return <CardGrid>{[1,2,3,4].map(i=><Loader key={i}/>)}</CardGrid>

  return (
    <div>
      <PageTitle>Destinos</PageTitle>
      <CardGrid>
        {destinations.map(dest=> (
          <Card key={dest.id}>
            <CardImg style={{backgroundImage:`url(${dest.imageUrl || ('https://picsum.photos/600/400?random=' + dest.id)})`}} />
            <CardBody>
              <Title>{dest.name}</Title>
              <Muted>{dest.city} • {dest.country}</Muted>
              <div style={{height:8}} />
              <div style={{display:'flex',gap:10}}>
                <Link to={`/trips?destination=${dest.id}`}>Ver viagens</Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </CardGrid>
    </div>
  )
}
