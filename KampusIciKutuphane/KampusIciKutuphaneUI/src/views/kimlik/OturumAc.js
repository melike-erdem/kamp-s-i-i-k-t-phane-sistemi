import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

const OturumAc = () => {

  //axios.defaults.withCredentials = true
  const webServisURL = useSelector(state => state.webServisURL)

  //Mesaj kutusu değerleri
  const [msgBoxGoster,setMsgBoxGoster]=useState(false);
  const [msgBoxMetin,setMsgBoxMetin]=useState('');
  const [msgBoxGeriDonus, setMsgBoxGeriDonus]=useState(null);

  //Sayfada kullanılacak değerler
  const [eposta,setEposta] = useState('');
  const [sifre,setSifre] = useState('');

  const history=useHistory();
  const dispatch=useDispatch();

  useEffect(()=>{
    axios.get(webServisURL + 'Kimlik')
    .then(response=>{
      dispatch({type: 'set', oturumacildi: true});
      history.push('/kitapbul');
    })
    .catch(error=>{
      dispatch({type: 'set', oturumacildi: false});
    })
  },[webServisURL,dispatch,history])
  

  const gonder = ()=>{

    if(!eposta || !sifre){
      setMsgBoxMetin("Lütfen formu doldurunuz.");
      setMsgBoxGoster(true);
      return;
    }

    axios.post(webServisURL + 'Kimlik',{eposta:eposta,sifre:sifre})
    .then(response=>{
      dispatch({type: 'set', oturumacildi: true});
      dispatch({type: 'set', kullaniciId: response.data.id});
      axios.interceptors.request.use(function (config) {
          const token = response.data.Sifre;
          config.headers.Authorization =  token;
          return config;
      });
      history.push('/kitapbul');
    })
    .catch(error=>{
      let hata='';
      if (error.response) {

        if(error.response.status===400){
          //Sunucuda bizim tespit ettiğimiz bir hatayı yakala
          hata = error.response.data.Message;
        } else {
          //Bizim tespit edemediğimiz başka bir hatayı yakala
          hata = error.message
          //konsolada yaz
          console.log({error});
        }

        //Hatayı mesaj kutusunda göster
        setMsgBoxMetin(hata);
        setMsgBoxGoster(true);
      }
    })
    
  }

  const msgBoxKapat=()=>{
    setMsgBoxGoster(false);
    
    if(msgBoxGeriDonus) 
      msgBoxGeriDonus();

    setMsgBoxGeriDonus(null)
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CModal
        show={msgBoxGoster}
        onClose={()=>msgBoxKapat()}
        >
          <CModalHeader>
              <CModalTitle>Uyarı</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {msgBoxMetin}
          </CModalBody>
          <CModalFooter>
              <CButton 
                color="secondary" 
                onClick={()=>msgBoxKapat()}
              >Tamam</CButton>
          </CModalFooter>
        </CModal>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <center>
            <img src="logo512.png" alt="logo" width="128px" />
            <h1>Kampüs İçi Kütüphane Sistemi</h1>
            </center>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Giriş</h1>
                    <p className="text-muted">Hesabınıza giriş yapın</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="E-posta adresi" autoComplete="email" onChange={e=>{setEposta(e.target.value)}} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Şifresi" autoComplete="current-password" onChange={e=>{setSifre(e.target.value)}} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={gonder}>Oturum Aç</CButton>
                      </CCol>
                      <CCol xs="6">
                        <Link to="/kayitol">
                          <CButton color="primary" className="px-6 float-right">Şimdi Kayıt Ol!</CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Kayıt ol</h2>
                    <p>Kampüsteki kitapları görmek ve kendi kitaplarını ekleyip takas edebilmek için kayıt olmalısın.</p>
                    <Link to="/kayitol">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Şimdi Kayıt Ol!</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default OturumAc
