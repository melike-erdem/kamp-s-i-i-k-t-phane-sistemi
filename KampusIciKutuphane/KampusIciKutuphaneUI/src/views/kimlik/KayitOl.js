import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
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
import axios from 'axios'
import { useSelector } from 'react-redux'

const KayitOl = ()=>{


  const webServisURL = useSelector(state => state.webServisURL)
  
  //Mesaj kutusu değerleri
  const [msgBoxGoster,setMsgBoxGoster]=useState(false);
  const [msgBoxMetin,setMsgBoxMetin]=useState('');
  const [msgBoxGeriDonus, setMsgBoxGeriDonus]=useState(null);

  //Sayfa verileri
  const [kullanici,setKullanici] = useState({
    eposta:'',
    adsoyad: '',
    sifre:'',
    sifre2: ''
  })

  //Formdaki herhangi bir alan değiştiğinde sayfadaki verileri güncelliyoruz
  const formDegisti=(event)=>{
    const alanismi = event.target.name;
    const degeri = event.target.value;

    //Sayfa verilerini yeni girilenler ile güncelliyoruz
    setKullanici(kullanici=>({
      ...kullanici,
      [alanismi]:degeri
    }))
  }

  //Hesabınızı oluşturun düğmesine basınca verileri kontrol edip sunucuya gönderiyoruz
  //Dönen cevabı kontrol edip başarılıysa oturum açma sayfasına
  //başarısızsa ekranda mesaj olarak gösteriyoruz
  const gonder=()=>{

    //Formdaki alanların hepsi dolu mu?
    if(!kullanici.sifre || 
      !kullanici.eposta || 
      !kullanici.adsoyad){

      setMsgBoxMetin('Formu doldurunuz.')
      setMsgBoxGoster(true)
      
      return;
    }

    //Yazılan şifreler aynı mı?
    if(kullanici.sifre!==kullanici.sifre2){
      setMsgBoxMetin('Yazdığınız şifreler uyuşmuyor.')
      setMsgBoxGoster(true)
      return;
    }

    //Kullanıcı bilgilerini sunucuya gönder
    axios.post(webServisURL + 'Kimlik/KayitOl', kullanici)
      .then(response => {
        //Başarılıysa mesaj göster
        setMsgBoxMetin('Hesabınız oluşturuldu. Giriş yapabilirsiniz.')
        setMsgBoxGeriDonus({
          calistir:function(){
            //Mesaj kutusu kapanınca oturum açma sayfasına yönlendir
            window.location='login'
          }
        })
        setMsgBoxGoster(true)
      })
      .catch(error=>{
        let hata='';
        //Başarısızsa
        if (error.response) {
          if(error.response.status===400){
            //Sunucuda bizim tespit ettiğimiz bir hatayı yakala
            hata= error.response.data.Message;
          }
        } else {
          //Bizim tespit edemediğimiz başka bir hatayı yakala
          hata=error.message;
          
          //konsolada yaz
          console.log({error});
        }

        //Hatayı mesaj kutusunda göster
        setMsgBoxMetin(hata);
        setMsgBoxGoster(true);
      });
  }

  //Mesaj kutusuda tamam düğmesine basıldığında mesaj kutusunu kapatır
  const msgBoxKapat=()=>{
    //Mesaj kutusunu kapat
    setMsgBoxGoster(false)

    //Eğer geri dönüş metodu dolu ise geri dönüş metodunu çalıştır
    if(msgBoxGeriDonus) msgBoxGeriDonus.calistir();

    //Geri dönüş metodunu temizle
    setMsgBoxGeriDonus(null)
  }

  //Ekrana çizilecek komponentler
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
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm>
                    <h1>Kayıt Ol</h1>
                    <p className="text-muted">Hesabınızı oluşturun</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>@</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput name="eposta" type="text" placeholder="E-posta" autoComplete="email" value={kullanici.eposta} onChange={e=>formDegisti(e)} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>@</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput name="adsoyad" type="text" placeholder="Ad Soyad" autoComplete="name" value={kullanici.adsoyad} onChange={e=>formDegisti(e)} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput name="sifre" type="password" placeholder="Şifre" autoComplete="new-password" value={kullanici.sifre} onChange={e=>formDegisti(e)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput name="sifre2" type="password" placeholder="Tekrar şifre" autoComplete="new-password" value={kullanici.sifre2} onChange={e=>formDegisti(e)} />
                    </CInputGroup>
                    <CButton color="success" block onClick={()=>gonder()}>Hesap Oluştur</CButton>
                    <Link to="/login">
                      <CButton color="back" block>Geri</CButton>
                    </Link>
                  </CForm>
                </CCardBody>
                
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
}

export default KayitOl
