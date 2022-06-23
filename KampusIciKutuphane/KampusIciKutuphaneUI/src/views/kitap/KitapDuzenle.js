import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CFormText, CInput, CInputGroup, CInputGroupAppend, CInputGroupText, CLabel, CLink, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CSelect, CSwitch, CTextarea } from "@coreui/react"
import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

const KitapDuzenle = ()=>{

    const webServisURL = useSelector(state => state.webServisURL)

    const history=useHistory()

    const {kitapId} = useParams()

    //Mesaj kutusu değerleri
    const [msgBoxGoster,setMsgBoxGoster]=useState(false);
    const [msgBoxMetin,setMsgBoxMetin]=useState('');
    const [msgBoxGeriDonus, setMsgBoxGeriDonus]=useState(null);

    const [kitap,setKitap]=useState({
        Aciklama: "",
        Ad: "",
        Aktif: true,
        Fiyat: 0,
        Takas: true,
        TurId: -1,
        YazarId: -1
    });

    const [turler,setTurler]=useState([])
    const [yazarlar,setYazarlar]=useState([])

    const turYukle=useCallback(()=>{
        axios.get(webServisURL + 'KitapTuru')
        .then(cevap=>{
            setTurler(cevap.data)
        })
        .catch(hata=>{

        })
    },[webServisURL]);

    const yazarYukle=useCallback(()=>{
        axios.get(webServisURL + 'Yazar')
        .then(cevap=>{
            setYazarlar(cevap.data)
        })
        .catch(hata=>{

        })
    },[webServisURL]);

    useEffect(()=>{
        if(kitapId){
            axios.get(webServisURL + 'Kitap/' + kitapId)
            .then(cevap=>{
                setKitap(cevap.data)
            })
            .catch(hata=>{

            })
        }

        turYukle()

        yazarYukle()
    },[kitapId,webServisURL,turYukle,yazarYukle])

    const kaydet=()=>{

        let sorgu;

        if(kitapId){
            sorgu=axios.put(webServisURL + 'Kitap/' + kitapId,kitap)
        }else{
            sorgu=axios.post(webServisURL + 'Kitap',kitap)
        }

        sorgu.then(cevap=>{
            history.push('/kitaplarim');
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

    const kitabiGuncelle=e=>{
        const alanIsmi=e.target.name;
        let degeri=e.target.value;

        if(degeri==="on")
            degeri=e.target.checked;

        if(alanIsmi==="Fiyat" && !degeri)
            degeri=0;

        if(alanIsmi==="TurId" || alanIsmi==="YazarId")
            degeri=parseInt(degeri);

        setKitap(kitap=>({
            ...kitap,
            [alanIsmi]:degeri
        }));
    }

    

    return (
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
                onClick={()=>msgBoxKapat()}
              >Tamam</CButton>
          </CModalFooter>
        </CModal>
        <CCard>
            <CCardHeader>
                <h3>Kitap Düzenle</h3>
            </CCardHeader>
            <CCardBody>
                <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel>Kitap Adı</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput name="Ad" placeholder="Kitabın tam adını girin" value={kitap?.Ad} onChange={e=>kitabiGuncelle(e)} />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel>Türü</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <div className="float-left">
                            <CSelect custom name="TurId" value={kitap.TurId?kitap.TurId:''} onChange={e=>kitabiGuncelle(e)}>
                                <option key="-1" value="-1">Tür seçiniz</option>
                                {
                                    turler.map(tur=>(
                                        <option key={tur.id} value={tur.id}>{tur.Ad}</option>
                                    ))
                                }
                            </CSelect>
                            </div>
                            <div className="float-right">
                                <CButton to="/turler">Tür Ekle</CButton>
                            </div>
                            
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel>Yazarı</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <div className="float-left">
                            <CSelect custom name="YazarId" value={kitap.YazarId?kitap.YazarId:''} onChange={e=>kitabiGuncelle(e)}>
                                <option key="-1" value="-1">Yazar seçiniz</option>
                                {
                                    yazarlar.map(yazar=>(
                                        <option key={yazar.id} value={yazar.id}>{yazar.AdSoyad}</option>
                                    ))
                                }
                            </CSelect>
                            </div>
                            <div className="float-right">
                                <CButton to="/yazarlar">Yazar Ekle</CButton>
                            </div>
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="textarea-input">Açıklama</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CTextarea 
                            name="Aciklama" 
                            rows="9"
                            placeholder="Kitapla ilgili söylemek istediklerinizi ve kitabın durumunu yazın" 
                            value={kitap?.Aciklama}
                            onChange={e=>kitabiGuncelle(e)}
                            />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol tag="label" sm="3" className="col-form-label">
                            Takas olabilir
                        </CCol>
                        <CCol sm="9">
                            <CSwitch
                            name="Takas"
                            className="mr-1"
                            color="primary"
                            checked={kitap?.Takas}
                            onChange={e=>kitabiGuncelle(e)}
                            />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel>Fiyat</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInputGroup>
                                <CInput name="Fiyat" size="16" type="text" placeholder="Bir fiyat yazın" value={kitap?.Fiyat} onChange={e=>kitabiGuncelle(e)} />
                                <CInputGroupAppend>
                                    <CInputGroupText>TL</CInputGroupText>
                                </CInputGroupAppend>
                            </CInputGroup>
                            <CFormText className="help-block">Satmak istemiyorsanız sıfır bırakabilirsiniz</CFormText>
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol tag="label" sm="3" className="col-form-label">
                            Aktif
                        </CCol>
                        <CCol sm="9">
                            <CSwitch
                            name="Aktif"
                            className="mr-1"
                            color="primary"
                            checked={kitap?.Aktif}
                            onChange={e=>kitabiGuncelle(e)}
                            />
                            <CFormText className="help-block">Aktif olan kitaplar herkes tarafından görülebilir</CFormText>
                        </CCol>
                    </CFormGroup>
                    <div className="form-actions float-right">
                      <CButton color="primary" onClick={()=>kaydet()}>Kaydet</CButton>
                      <CLink to="/kitaplarim">
                      <CButton color="secondary">İptal</CButton>
                      </CLink>
                    </div>
                </CForm>
            </CCardBody>
        </CCard>
        </>
    )
}

export default KitapDuzenle