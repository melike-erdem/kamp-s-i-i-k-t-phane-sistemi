import CIcon from "@coreui/icons-react"
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CDataTable, CLink, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"


const sutunAdlari = ['Ad', 'Takas', 'Fiyat', 'Aktif', ' ']

const Kitaplarim = ()=>{
  const gecmis = useHistory()

  const webServisURL = useSelector(state => state.webServisURL)

  //Mesaj kutusu değerleri
  const [msgBoxGoster,setMsgBoxGoster]=useState(false);
  const [msgBoxMetin,setMsgBoxMetin]=useState('');
  const [msgBoxGeriDonus, setMsgBoxGeriDonus]=useState(null);
  const [msgBoxOnay, setMsgBoxOnay] = useState(false);

  const msgBoxKapat=(tamam)=>{
    setMsgBoxGoster(false);
    
    if(msgBoxGeriDonus && msgBoxOnay && tamam)
      msgBoxGeriDonus.calistir();

    setMsgBoxGeriDonus(null)
  }

  const [kitaplarim,setKitaplarim]=useState([]);


  const kitaplarimiYukle=useCallback(()=>{
    axios.get(webServisURL + 'Kitap')
    .then(cevap=>{
      //console.log(cevap);
      setKitaplarim(cevap.data);
    })
    .catch(error=>{

    });
  },[webServisURL]);

   

  useEffect(()=>{
    kitaplarimiYukle();
  },[kitaplarimiYukle])

  const kitapDuzenle=kitap=>{
    gecmis.push("/kitapduzenle/"+kitap.id)
  }

  const kitapSil=kitap=>{

    setMsgBoxMetin('Silmek istediğinize emin misiniz?')
    setMsgBoxOnay(true)
    setMsgBoxGeriDonus({
      calistir:()=>{
        axios.delete(webServisURL + 'Kitap/'+kitap.id)
        .then(cevap=>{
          kitaplarimiYukle();
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
        <CCard>
            <CCardHeader>
              <div className="float-left"><h3>Kitaplarım</h3></div>
              <div className="card-header-actions">
                <CLink to="/kitapduzenle">
                <CButton color="primary" className="float-right">Ekle</CButton>
                </CLink>
              </div>
              
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={kitaplarim}
              fields={sutunAdlari}
              striped
              itemsPerPage={8}
              pagination
              onRowClick={item=>kitapDuzenle(item)}
              noItemsView={{
                noItems:'Hiç Kitabınız Yok'
              }
              }
              scopedSlots = {{
                'Fiyat':(item)=>(
                  <td>
                      {item.Fiyat===0?'':item.Fiyat+'TL'}
                  </td>
                ),
                'Takas':(item)=>(
                  <td>
                      {item.Takas?'Var':'Yok'}
                  </td>
                ),
                'Aktif':
                  (item)=>(
                    <td>
                      <CBadge color={item.Aktif?'success':'secondary'}>
                        {item.Aktif?"Aktif":"Pasif"}
                      </CBadge>
                    </td>
                ),
                ' ':(item)=>(
                  <td>
                    <CButton style={{height:24,padding:0}}><CIcon name="cil-pencil" onClick={(e)=>{e.preventDefault();e.stopPropagation();kitapDuzenle(item)}}></CIcon></CButton>
                    <CButton style={{height:24,padding:0}}><CIcon name="cil-trash" onClick={(e)=>{e.preventDefault();e.stopPropagation();kitapSil(item)}}></CIcon></CButton>
                  </td>
                )
              }}
            />
            </CCardBody>
          </CCard>
        </>
    )
}

export default Kitaplarim