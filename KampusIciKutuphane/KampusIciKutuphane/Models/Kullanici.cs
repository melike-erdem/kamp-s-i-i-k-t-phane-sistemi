using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace KampusIciKutuphane.Models
{
    [Table("Kullanicilar")]
    public class Kullanici
    {
        public int id { get; set; }

        [StringLength(100)]
        public string Eposta { get; set; }

        [StringLength(100)]
        public string AdSoyad { get; set; }

        [StringLength(100)]
        public string Sifre { get; set; }

        public ICollection<Kitap> Kitaplar { get; set; }
    }
}