import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CContainer, CForm, CFormGroup, CInput, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSelect, CTextarea } from "@coreui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const KitapBul = () =>{

  const webServisURL = useSelector(state => state.webServisURL)
  const kullaniciId = useSelector(state => state.kullaniciId)

  const [mesajGonderGoster, setMesajGonderGoster] = useState(false)
  
  const [kitaplar,setKitaplar] = useState([]);
  const [turler,setTurler] = useState([]);
  const [seciliTur,setSeciliTur] = useState(0);
  const [aranan,setAranan] = useState('');
  const [mesaj,setMesaj] = useState({
    Icerik:'',
    KimeId: 0
  })

  const [kitap,setKitap] = useState({
    SahibiAdSoyad:''
  })

  useEffect(()=>{
    axios.get(webServisURL+'KitapTuru')
    .then(cevap=>{
      setTurler(cevap.data)
    })
    .catch(hata=>{

    })
  },[webServisURL])

  const mesajGonderAc = (kitap)=>{
    
    if(kitap.SahipId === kullaniciId){
      alert('Kendinize mesaj gönderemezsiniz.');
      return;
    }

    setKitap(kitap);

    setMesaj(mesaj=>({
      ...mesaj,
      KimeId:kitap.SahipId
    }))

    setMesajGonderGoster(true);
  }

  const close=()=>{
    setMesajGonderGoster(false);
  }

  const mesajGonder=()=>{
    axios.post(webServisURL + 'Mesaj',mesaj)
    .then(cevap=>{
      close();
    })
    .catch(hata=>{

    })
  }

  const kitapAra=()=>{

    axios.get(webServisURL+'Kitap?aranan='+aranan+'&tur=' + seciliTur)
    .then(cevap=>{
      var liste=[];
      for (let index = 0; index < cevap.data.length; index=index+3) {
        liste.push([
          cevap.data[index],
          cevap.data[index+1],
          cevap.data[index+2]
        ])
      }
      console.log(liste);
      setKitaplar(liste);
    })
    .catch(hata=>{

    })
  }

    return(
        <>
        <CModal
        show={mesajGonderGoster}
        onClose={close}
        >
          <CModalHeader>
              <CModalTitle>Mesaj Gönder</CModalTitle>
              <div >Kitap Sahibi: {kitap.SahibiAdSoyad}</div>
          </CModalHeader>
          <CModalBody>
            <CTextarea 
              name="textarea-input" 
              id="textarea-input" 
              rows="9"
              placeholder="Mesajınızı yazın" 
              value={mesaj.Icerik}
              onChange={e=>{setMesaj(mesaj=>({...mesaj,Icerik:e.target.value}))}}
              />
          </CModalBody>
          <CModalFooter>
              <CButton color="primary" onClick={mesajGonder}>Gönder</CButton>{' '}
              <CButton 
                color="secondary" 
                onClick={close}
              >Kapat</CButton>
          </CModalFooter>
        </CModal>
        <CCard>
          <CCardHeader>
            <h3>Kitap Bul</h3>
          </CCardHeader>
          <CCardBody>
            <CForm className="form-horizontal">
              <CFormGroup row>
                <CCol md="12">
                  <CInputGroup>
                    <CSelect className="col-sm-1" value={seciliTur} onChange={e=>setSeciliTur(e.target.value)}>
                        <option key="0" value="0">Tüm Türler</option>
                        {
                            turler.map(tur=>(
                                <option key={tur.id} value={tur.id}>{tur.Ad}</option>
                            ))
                        }
                    </CSelect>
                    <CInput placeholder="Ara" value={aranan} onChange={(e)=>{setAranan(e.target.value)}} />
                    <CButton color="primary" className="px-4" onClick={()=>kitapAra()}>Ara</CButton>
                  </CInputGroup>
                </CCol>
              </CFormGroup>
            </CForm>
          </CCardBody>
        </CCard>

        <CContainer>
        {
          kitaplar.map((satir,index)=>
            <CRow hidden={!satir} key={index}>
              {
                satir.map((kitap,index)=>
                  <CCol xs="12" sm="6" md="4" key={index}>
                    <CCard hidden={!kitap} >
                      <CCardHeader>
                        <div className='float-left'><h4>{kitap?.Ad}</h4><br/><small>{kitap?.YazarAdSoyad} - {kitap?.TurAdi}</small></div>
                        <div className='float-right'>
                        {kitap?.Takas?"Takas olur":""}<br/>
                        {kitap?.Fiyat!==0?kitap?.Fiyat + "TL":""}
                        </div>
                      </CCardHeader>
                      <CCardBody>{kitap?.Aciklama}</CCardBody>
                      <CCardFooter>
                        Sahibi: {kitap?.SahibiAdSoyad}
                        <CButton className="float-right" color="primary" onClick={()=>mesajGonderAc(kitap)}>Mesaj Gönder</CButton>
                      </CCardFooter>
                    </CCard>
                  </CCol>
                )
              }
            </CRow>
          )
        }
        </CContainer>

        <CRow>
          <CCol xs="12" sm="6" md="4">
            
          </CCol>
          <CCol xs="12" sm="6" md="4">
          
          </CCol>
          <CCol xs="12" sm="6" md="4">
          
          </CCol>
        </CRow>
        
        </>
    )
}

export default KitapBul