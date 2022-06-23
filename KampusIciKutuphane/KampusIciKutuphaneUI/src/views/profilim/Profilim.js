import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CFormText, CInput, CLabel} from "@coreui/react"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

const Profilim = ()=>{
    const history = useHistory();

    const webServisURL = useSelector(state => state.webServisURL)

    const [profil,setProfil] = useState({
        Eposta:'',
        AdSoyad:'',
        Sifre:''
    })

    const kullaniciId = useSelector(state => state.kullaniciId)

    const profilYukle=useCallback(()=>{
        axios.get(webServisURL + 'Kullanici/' + kullaniciId)
        .then(cevap=>{
            //console.log(cevap);
            setProfil(cevap.data);
        })
        .catch(error=>{

        });
    },[webServisURL,kullaniciId])

    useEffect(()=>{
        profilYukle();
    },[profilYukle])

    const profilGuncelle=e=>{
        const alanIsmi=e.target.name;
        let deger = e.target.value;

        setProfil(profil=>({
            ...profil,
            [alanIsmi]:deger
        }))
    }

    const kaydet=()=>{
        axios.put(webServisURL+'Kullanici/'+kullaniciId,profil)
        .then(cevap=>{
            history.push('/kitapbul')
        })
        .catch(hata=>{

        })
    }

    const iptal=()=>{
        history.push('/kitapbul')
    }

    return (
        <>
        <CCard>
            <CCardHeader>
                <h3>Profilim</h3>
            </CCardHeader>
            <CCardBody>
                <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel>E-posta Adresi</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <p className="form-control-static">{profil.Eposta}</p>
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel>Ad Soyad</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput id="text-input" name="AdSoyad" placeholder="Tam adınızı girin" value={profil.AdSoyad} onChange={(e)=>{profilGuncelle(e)}} />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="password-input">Şifre</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput type="password" id="password-input" name="Sifre" placeholder="Şifre" autoComplete="new-password" value={profil.Sifre} onChange={(e)=>{profilGuncelle(e)}} />
                            <CFormText className="help-block">Karmaşık bir şifre giriniz</CFormText>
                        </CCol>
                    </CFormGroup>
                    <div className="form-actions float-right">
                      <CButton color="primary" onClick={kaydet} >Kaydet</CButton>
                      <CButton color="secondary" onClick={iptal} >İptal</CButton>
                    </div>
                </CForm>
            </CCardBody>
        </CCard>
        </>
    )
}

export default Profilim