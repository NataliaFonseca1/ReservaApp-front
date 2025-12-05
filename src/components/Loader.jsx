import styled, { keyframes } from 'styled-components'
import React from 'react'

const pulse = keyframes`0%{opacity:0.6}50%{opacity:1}100%{opacity:0.6}`
export const LoaderBox = styled.div`
  height:120px; border-radius:10px; background: linear-gradient(90deg,#eef6ff,#ffffff);
  display:flex; align-items:center; justify-content:center; animation: ${pulse} 1.1s infinite;
`

export default function Loader(){
  return <LoaderBox>Carregando...</LoaderBox>
}
