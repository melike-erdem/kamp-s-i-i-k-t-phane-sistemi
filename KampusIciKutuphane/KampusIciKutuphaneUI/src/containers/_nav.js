
const _nav =  [
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Kütüphane']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Kitap Bul',
    to: '/kitapbul',
    icon: 'cil-search',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Kitaplarım',
    to: '/kitaplarim',
    icon: 'cil-book',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Sistem']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Mesajlar',
    to: '/mesajlar',
    icon: 'cil-envelope-open'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Kitap Türleri',
    to: '/turler',
    icon: 'cil-info'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Yazarlar',
    to: '/yazarlar',
    icon: 'cil-info'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Profilim',
    to: '/profilim',
    icon: 'cil-user'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Çıkış',
    to: '/cikis',
    icon: 'cil-account-logout'
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

export default _nav
