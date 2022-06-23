import { createStore } from 'redux'

const initialState = {
  sidebarShow: 'responsive',
  oturumacildi: false,
  webServisURL: 'https://localhost/KampusIciKutuphane/api/',
  kullaniciId: 0
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return {...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store