// src/components/Header.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const HeaderWrap = styled.header`
  display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:22px;
`;
const Brand = styled(Link)`
  text-decoration:none; font-weight:800; font-size:22px; color:#0b2545;
`;
const Nav = styled.nav`
  display:flex; gap:12px; align-items:center;
`;
const NavLink = styled(Link)`
  padding:8px 12px; border-radius:10px; text-decoration:none; color:#0b2545; font-weight:600;
  &:hover{ background: rgba(11,37,69,0.06); }
`;
const Accent = styled.span`
  background: linear-gradient(90deg,#e8f3ff,#f0fcff);
  padding:6px 10px;
  border-radius:8px;
  font-size:13px;
  color:#055a8c;
  margin-left:8px;
  font-weight:700;
`

export default function Header(){
  return (
    <HeaderWrap>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <Brand to="/">ReservaApp</Brand>
        <Accent>Viaje Melhor</Accent>
      </div>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/destinations">Destinos</NavLink>
        <NavLink to="/trips">Viagens</NavLink>
        <NavLink to="/my-bookings">Minhas reservas</NavLink>
      </Nav>
    </HeaderWrap>
  )
}
