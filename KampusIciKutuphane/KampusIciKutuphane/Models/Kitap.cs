using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace KampusIciKutuphane.Models
{
    [Table("Kitaplar")]
    public class Kitap
    {
        public int id { get; set; }

        [StringLength(100)]
        public string Ad { get; set; }

        public string Aciklama { get; set; }

        
        [ForeignKey("Yazar")]
        public int YazarId { get; set; }
        public Yazar Yazar { get; set; }

        public bool Aktif { get; set; }

        public bool Takas { get; set; }

        public decimal Fiyat { get; set; }

        [ForeignKey("Turu")]
        public int TurId { get; set; }
        public KitapTuru Turu { get; set; }

        [ForeignKey("Sahibi")]
        public int SahipId { get; set; }
        public Kullanici Sahibi { get; set; }


        [NotMapped]
        public string SahibiAdSoyad { get; set; }

        [NotMapped]
        public string YazarAdSoyad { get; set; }

        [NotMapped]
        public string TurAdi { get; set; }

    }
}