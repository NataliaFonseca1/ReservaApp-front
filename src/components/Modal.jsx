// src/components/Modal.jsx
import React from 'react'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3,12,26,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
`
const Box = styled.div`
  background: white;
  padding: 20px;
  width: 420px;
  max-width: calc(100% - 40px);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(4,8,20,0.25);
`
const Title = styled.h3`margin:0 0 8px 0;`
const Content = styled.div`color:#334e68; margin-bottom:12px;`
const Row = styled.div`display:flex; gap:10px; justify-content:flex-end;`
const Button = styled.button`
  background: linear-gradient(90deg,#0070f3,#00c2ff);
  border: none; color: white; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:700;
`

export default function Modal({ open=true, title, children, primaryLabel='Fechar', onPrimary }) {
  if(!open) return null
  return (
    <Overlay onClick={onPrimary}>
      <Box onClick={e => e.stopPropagation()}>
        {title && <Title>{title}</Title>}
        <Content>{children}</Content>
        <Row>
          <Button onClick={onPrimary}>{primaryLabel}</Button>
        </Row>
      </Box>
    </Overlay>
  )
}
