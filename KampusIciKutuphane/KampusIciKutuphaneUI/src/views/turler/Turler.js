import CIcon from "@coreui/icons-react"
import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"


const sutunAdlari = ['Ad', ' ']

const Turler = ()=>{

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
  const [turDuzenleGoster,setTurDuzenleGoster]=useState(false);
  const [tur,setTur]=useState({
      id:0,
      Ad:''
  });

  const turDuzenleKapat=()=>{
    setTurDuzenleGoster(false);
  }

  const turKaydet=()=>{
      if(tur.id===0){
        axios.post(webServisURL + 'KitapTuru',tur)
        .then(cevap=>{
            setTur({
                id:0,
                Ad:''
            })
            turleriYukle();
        })
        .catch(hata=>{

        })
      }else{
        axios.put(webServisURL + 'KitapTuru/'+tur.id,tur)
        .then(cevap=>{
            setTur({
                id:0,
                Ad:''
            })
            turleriYukle();
        })
        .catch(hata=>{

        })
      }

      setTurDuzenleGoster(false);
  }

  //Türler
  const [turler,setTurler]=useState([]);

  const turleriYukle=useCallback(()=>{
    axios.get(webServisURL + 'KitapTuru')
    .then(cevap=>{
      //console.log(cevap);
      setTurler(cevap.data);
    })
    .catch(error=>{

    });
  },[webServisURL]);

  const turDuzenle=tur=>{
    if(tur)
        setTur(tur);
    setTurDuzenleGoster(true);
  }

  const turSil=tur=>{

    setMsgBoxMetin('Silmek istediğinize emin misiniz?')
    setMsgBoxOnay(true)
    setMsgBoxGeriDonus({
      calistir:()=>{
        axios.delete(webServisURL + 'KitapTuru/'+tur.id)
        .then(cevap=>{
          turleriYukle();
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
    turleriYukle();
  },[turleriYukle])

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
        show={turDuzenleGoster}
        onClose={()=>turDuzenleKapat()}
        >
          <CModalHeader>
              <CModalTitle>Kitap Türü</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Ad: <CInput value={tur.Ad} onChange={(e)=>setTur(tur=>({...tur,Ad:e.target.value}))}></CInput>
          </CModalBody>
          <CModalFooter>
              <CButton 
                color="secondary" 
                onClick={()=>turKaydet()}
              >Tamam</CButton>
              <CButton
                color="secondary" 
                onClick={()=>turDuzenleKapat(false)}
              >İptal</CButton>
          </CModalFooter>
        </CModal>

        <CCard>
            <CCardHeader>
              <div className="float-left"><h3>Kitap Türleri</h3></div>
              <div className="card-header-actions">
                <CButton color="primary" className="float-right" onClick={()=>turDuzenle()}>Ekle</CButton>
              </div>
              
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={turler}
              fields={sutunAdlari}
              striped
              itemsPerPage={8}
              pagination
              onRowClick={item=>turDuzenle(item)}
              noItemsView={{
                noItems:'Hiç Kitap Türü Yok'
              }
              }
              scopedSlots = {{
                ' ':(item)=>(
                  <td>
                    <CButton style={{height:24,padding:0}}><CIcon name="cil-pencil" onClick={(e)=>{e.preventDefault();e.stopPropagation(); turDuzenle(item)}}></CIcon></CButton>
                    <CButton style={{height:24,padding:0}}><CIcon name="cil-trash" onClick={(e)=>{e.preventDefault();e.stopPropagation();turSil(item)}}></CIcon></CButton>
                  </td>
                )
              }}
            />
            </CCardBody>
          </CCard>
        </>
    )
}

export default Turler