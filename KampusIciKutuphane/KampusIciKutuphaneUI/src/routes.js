import React from 'react';

const KitapBul = React.lazy(()=> import('./views/kitap/KitapBul'));
const Kitaplarim = React.lazy(()=> import('./views/kitap/Kitaplarim'));
const KitapDuzenle = React.lazy(()=> import('./views/kitap/KitapDuzenle'));
const Mesajlar = React.lazy(()=> import('./views/mesaj/Mesajlar'));
const Turler = React.lazy(()=> import('./views/turler/Turler'));
const Yazarlar = React.lazy(()=> import('./views/yazarlar/Yazarlar'));
const Profilim = React.lazy(()=> import('./views/profilim/Profilim'));
const Cikis = React.lazy(()=> import('./views/kimlik/Cikis'));

const routes = [
  { path: '/kitapbul', name: 'Kitap Bul', component: KitapBul },
  { path: '/kitaplarim', name: 'Kitaplarım', component: Kitaplarim },
  { path: '/kitapduzenle/:kitapId', name: 'Kitap Düzenle', component: KitapDuzenle },
  { path: '/kitapduzenle', name: 'Kitap Düzenle', component: KitapDuzenle },
  { path: '/mesajlar', name: 'Mesajlar', component: Mesajlar },
  { path: '/turler', name: 'Türler', component: Turler },
  { path: '/yazarlar', name: 'Yazarlar', component: Yazarlar },
  { path: '/profilim', name: 'Profilim', component: Profilim },
  { path: '/cikis', name: 'Çıkış', component: Cikis },
];

export default routes;
