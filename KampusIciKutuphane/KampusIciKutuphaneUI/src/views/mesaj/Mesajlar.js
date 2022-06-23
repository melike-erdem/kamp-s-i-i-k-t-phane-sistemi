import CIcon from "@coreui/icons-react"
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCol, CContainer, CDataTable, CForm, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from "@coreui/react"
import axios from "axios"
import dateFormat from "dateformat"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"


const mesajGonderenAlanlari = ['Kimden','Tarih', 'Durum', ' ']
const mesajAlanlari = ['Yazışma']

const Mesajlar = ()=>{

  const webServisURL = useSelector(state => state.webServisURL)
  const kullaniciId = useSelector(state => state.kullaniciId)

  //Mesaj kutusu değerleri
  const [msgBoxGoster,setMsgBoxGoster]=useState(false);
  const [msgBoxMetin,setMsgBoxMetin]=useState('');
  const [msgBoxGeriDonus, setMsgBoxGeriDonus]=useState(null);
  const [msgBoxOnay, setMsgBoxOnay] = useState(false);


  const [mesajGonderenler,setMesajGonderenler] = useState([])
  const [mesajGonderen,setMesajGonderen] = useState(null)
  const [mesajlar,setMesajlar] = useState([])
  const [mesaj,setMesaj] = useState('')

  const msgBoxKapat=(tamam)=>{
    setMsgBoxGoster(false);
    
    if(msgBoxGeriDonus && msgBoxOnay && tamam)
      msgBoxGeriDonus.calistir();

    setMsgBoxGeriDonus(null)
  }

  const mesajGonderenleriYukle =useCallback(()=>{
    axios.get(webServisURL + 'Mesaj')
    .then(cevap=>{
        setMesajGonderenler(cevap.data)
    })
    .catch(hata=>{

    })
  },[webServisURL])

  useEffect(()=>{
    mesajGonderenleriYukle()
  },[mesajGonderenleriYukle])

  const mesajGonderenSecildi = (seciliGonderen)=>{
    setMesajGonderen(seciliGonderen)
    axios.get(webServisURL + 'Mesaj/' + seciliGonderen.id)
    .then(cevap=>{
        setMesajlar(cevap.data)
        mesajGonderenleriYukle()
    })
    .catch(hata=>{

    })
  }

  const gonder = ()=>{
    if(!mesaj || mesaj==='') return;

    axios.post(webServisURL + 'Mesaj',{
      KimeId: mesajGonderen.id,
      Icerik: mesaj
    })
    .then(cevap=>{
      setMesaj('')
      mesajGonderenSecildi(mesajGonderen)
    })
    .catch(hata=>{

    })
  }

  const mesajSil=mesaj=>{

    setMsgBoxMetin('Bu mesaj grubunu silmek istediğinize emin misiniz?')
    setMsgBoxOnay(true)
    setMsgBoxGeriDonus({
      calistir:()=>{
        axios.delete(webServisURL + 'Mesaj/'+mesaj.id)
        .then(cevap=>{
          mesajGonderenleriYukle();
          setMesajlar([]);
        })
        .catch(error=>{

        })
      }
    })

    setMsgBoxGoster(true)
    
  }

  return(
      <>
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
                onClick={()=>msgBoxKapat(true)}
              >Tamam</CButton>
              <CButton hidden={!msgBoxOnay}
                color="secondary" 
                onClick={()=>msgBoxKapat(false)}
              >İptal</CButton>
          </CModalFooter>
        </CModal>
      <CContainer>
        <CRow>
          <CCol xs="12"  xxl="6">
            <CCard>
              <CCardHeader>
                <h3>Mesaj Gönderenler</h3>
              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={mesajGonderenler}
                  fields={mesajGonderenAlanlari}
                  striped
                  itemsPerPage={8}
                  pagination
                  noItemsView={{
                    noItems:'Hiç Mesaj Gönderen Yok'
                  }}
                  onRowClick={mesajGonderenSecildi}
                  scopedSlots = {{
                    'Tarih':
                      (item)=>(
                        <td>
                          {dateFormat(new Date(item.Tarih),'dd.mm.yyyy HH:MM')}
                        </td>
                      ),
                    'Durum':
                      (item)=>(
                        <td>
                          <CBadge color={item.Okunmadi?"success":"secondary"}>
                            {item.Okunmadi?"Okunmadı":"Okundu"}
                          </CBadge>
                        </td>
                      ),
                    ' ':(item)=>(
                        <td>
                            <CButton style={{height:24,padding:0}} onClick={()=>mesajSil(item)} ><CIcon name="cil-trash"></CIcon></CButton>
                        </td>
                    )

                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>

          <CCol xs="12" xxl="6">
            <CCard>
              <CCardHeader>
                <h3>Mesajlar</h3>
              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={mesajlar}
                  fields={mesajAlanlari}
                  striped
                  noItemsView={{
                    noItems:'Bir Mesaj Gönderen Seçin'
                  }}
                  scopedSlots = {{
                    'Yazışma':
                      (item)=>(
                        <td>
                          <div 
                          className={item.KimdenId===kullaniciId?"float-left":"float-right"}

                          style={{textAlign:item.KimdenId===kullaniciId?"left":"right"}}
                          >
                            <small>{item.KimdenAdSoyad} {dateFormat(new Date(item.GonderimTarihi),'dd.mm.yyyy HH:MM')}</small><br/>
                            {item.Icerik}
                            </div>
                        </td>
                      )
                  }}
                />
                <CForm hidden={!mesajGonderen} action="" method="post" encType="multipart/form-data" className="form-horizontal">
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel>Mesaj</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput id="text-input" name="AdSoyad" placeholder="Göndereceğiniz mesajı giriniz" value={mesaj} onChange={(e)=>{setMesaj(e.target.value)}} />
                        </CCol>
                    </CFormGroup>
                    <div className="form-actions float-right">
                      <CButton color="primary" onClick={gonder} >Gönder</CButton>
                    </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      
      </>
  )
}

export default Mesajlar