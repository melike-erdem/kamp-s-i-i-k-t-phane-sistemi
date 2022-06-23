import CIcon from "@coreui/icons-react"
import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"


const sutunAdlari = ['AdSoyad', ' ']

const Yazarlar = ()=>{

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

  //Tür düzenleme kutusu değerleri
  const [yazarDuzenleGoster,setYazarDuzenleGoster]=useState(false);
  const [yazar,setYazar]=useState({
      id:0,
      AdSoyad:''
  });

  const yazarDuzenleKapat=()=>{
    setYazarDuzenleGoster(false);
  }

  const yazarKaydet=()=>{
      if(yazar.id===0){
        axios.post(webServisURL + 'Yazar',yazar)
        .then(cevap=>{
            setYazar({
                id:0,
                AdSoyad:''
            })
            yazarlariYukle();
        })
        .catch(hata=>{

        })
      }else{
        axios.put(webServisURL + 'Yazar/'+yazar.id,yazar)
        .then(cevap=>{
            setYazar({
                id:0,
                AdSoyad:''
            })
            yazarlariYukle();
        })
        .catch(hata=>{

        })
      }

      setYazarDuzenleGoster(false);
  }

  //Yazarlar
  const [yazarlar,setYazarlar]=useState([]);

  const yazarlariYukle=useCallback(()=>{
    axios.get(webServisURL + 'Yazar')
    .then(cevap=>{
      setYazarlar(cevap.data);
    })
    .catch(error=>{

    });
  },[webServisURL]);

  const yazarDuzenle=yazar=>{
    if(yazar)
        setYazar(yazar);
    setYazarDuzenleGoster(true);
  }

  const yazarSil=tur=>{

    setMsgBoxMetin('Silmek istediğinize emin misiniz?')
    setMsgBoxOnay(true)
    setMsgBoxGeriDonus({
      calistir:()=>{
        axios.delete(webServisURL + 'Yazar/'+tur.id)
        .then(cevap=>{
          yazarlariYukle();
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
    })

    setMsgBoxGoster(true)
    
  }

  //Sayfa açıldığında
  useEffect(()=>{
    yazarlariYukle();
  },[yazarlariYukle])

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

        <CModal
        show={yazarDuzenleGoster}
        onClose={()=>yazarDuzenleKapat()}
        >
          <CModalHeader>
              <CModalTitle>Yazar</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Ad Soyad: <CInput value={yazar.AdSoyad} onChange={(e)=>setYazar(yazar=>({...yazar,AdSoyad:e.target.value}))}></CInput>
          </CModalBody>
          <CModalFooter>
              <CButton 
                color="secondary" 
                onClick={()=>yazarKaydet()}
              >Tamam</CButton>
              <CButton
                color="secondary" 
                onClick={()=>yazarDuzenleKapat(false)}
              >İptal</CButton>
          </CModalFooter>
        </CModal>

        <CCard>
            <CCardHeader>
              <div className="float-left"><h3>Yazarlar</h3></div>
              <div className="card-header-actions">
                <CButton color="primary" className="float-right" onClick={()=>yazarDuzenle()}>Ekle</CButton>
              </div>
              
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={yazarlar}
              fields={sutunAdlari}
              striped
              itemsPerPage={8}
              pagination
              onRowClick={item=>yazarDuzenle(item)}
              noItemsView={{
                noItems:'Hiç Yazar Yok'
              }
              }
              scopedSlots = {{
                ' ':(item)=>(
                  <td>
                    <CButton style={{height:24,padding:0}}><CIcon name="cil-pencil" onClick={(e)=>{e.preventDefault();e.stopPropagation(); yazarDuzenle(item)}}></CIcon></CButton>
                    <CButton style={{height:24,padding:0}}><CIcon name="cil-trash" onClick={(e)=>{e.preventDefault();e.stopPropagation();yazarSil(item)}}></CIcon></CButton>
                  </td>
                )
              }}
            />
            </CCardBody>
          </CCard>
        </>
    )
}

export default Yazarlar