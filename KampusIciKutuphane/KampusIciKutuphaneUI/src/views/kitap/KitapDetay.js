import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react"
import { useEffect, useState } from "react"



const KitapDetay=(props)=>{

    const {show, kitap, onClose} = props;

    //const [modal, setModal] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(show)
    }, [show])

    const close = ()=>{
        setIsOpen(false);
        onClose();
    } 

    return (
        <>
        <CModal
        show={isOpen}
        onClose = {close}
        >
            <CModalHeader>
                <CModalTitle>{kitap?.ad}<br/><small>{kitap?.yazar}</small></CModalTitle>
                {kitap?.takas?'Takas yapılabilir':''}<br/>
                {kitap?.fiyat>0?kitap.fiyat + 'TL':''}
            </CModalHeader>
            <CModalBody>
                {kitap?.aciklama}
            </CModalBody>
            <CModalFooter>
                Sahibi: {kitap?.kullanici.ad}
                <CButton color="primary">Mesaj Gönder</CButton>{' '}
                <CButton 
                  color="secondary" 
                  onClick={close}
                >Kapat</CButton>
              </CModalFooter>
        </CModal>
        </>
    )
}

export default KitapDetay