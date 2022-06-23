import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function KimlikKontrolu (ComposedComponent) {
  const KimlikKontrolu=(props) => {
    const history = useHistory();
    const oturumacildi = useSelector(state => state.oturumacildi)
    
    useEffect(() =>{
      if(!oturumacildi) {
        history.push('oturumac');
      }
    })
    return <ComposedComponent {...props}/>
  }

  return KimlikKontrolu
}