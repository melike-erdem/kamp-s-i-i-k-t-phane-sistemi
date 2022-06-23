using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace KampusIciKutuphane.Models
{
    [Table("Mesajlar")]
    public class Mesaj
    {
        public int id { get; set; }

        public string Icerik { get; set; }

        public bool Okundu { get; set; }


        [ForeignKey("Kimden")]
        public int KimdenId { get; set; }
        public Kullanici Kimden { get; set; }

        [NotMapped]
        public string KimdenAdSoyad { get; set; }

        [ForeignKey("Kime")]
        public int KimeId { get; set; }
        public Kullanici Kime { get; set; }

        public DateTime GonderimTarihi { get; set; }



    }
}