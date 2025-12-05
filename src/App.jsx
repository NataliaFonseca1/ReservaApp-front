import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import Header from './components/Header'
import Home from './components/Home'
import Destinations from './pages/Destinations'
import Trips from './pages/Trips'
import TripDetails from './pages/TripDetails'
import BookingForm from './pages/BookingForm'
import MyBookings from './pages/MyBookings'

const AppShell = styled.div`
  background: linear-gradient(180deg, #f6fbff 0%, #ffffff 100%);
  min-height: 100vh;
  color: #102a43;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
`;
const Container = styled.div`
  max-width:1100px; margin:0 auto; padding:28px;
`;

export default function App(){
  return (
    <AppShell>
      <Container>
        <Header />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/destinations' element={<Destinations/>} />
          <Route path='/trips' element={<Trips/>} />
          <Route path='/trips/:id' element={<TripDetails/>} />
          <Route path='/book/:id' element={<BookingForm/>} />
          <Route path='/my-bookings' element={<MyBookings/>} />
          <Route path='*' element={<div>404 — Página não encontrada</div>} />
        </Routes>
      </Container>
    </AppShell>
  )
}
