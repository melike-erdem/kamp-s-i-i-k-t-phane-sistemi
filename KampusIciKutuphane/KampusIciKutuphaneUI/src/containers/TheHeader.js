import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CButton,
  CBadge
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import axios from 'axios'

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)
  const webServisURL = useSelector(state => state.webServisURL)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const fontSize={
    fontSize:"14px"
  }

  const [mesajSayisi,setMesajSayisi] = useState(0)

  useEffect(()=>{
    axios.get(webServisURL + 'Mesaj?okunmamis=1')
    .then(cevap=>{
      setMesajSayisi(parseInt(cevap.data))
    })
    .catch(hata=>{

    })
  })


  return (
    <CHeader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/kitapbul">
        <img src="logo512.png" alt="logo" width="32px"/>
        <div style={fontSize}>Kampüs İçi Kütüphane Sistemi</div>
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/kitapbul">Kitap Bul</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem  className="px-3">
          <CHeaderNavLink to="/kitaplarim">Kitaplarım</CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <CButton to="/mesajlar">
          <CIcon hidden={mesajSayisi===0} name="cil-envelope-closed" />
          <CBadge hidden={mesajSayisi===0} shape="pill" color="info">{mesajSayisi}</CBadge>
        </CButton>
      </CHeaderNav>
    </CHeader>
  )
}

export default TheHeader
