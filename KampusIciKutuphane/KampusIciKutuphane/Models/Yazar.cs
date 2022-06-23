using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace KampusIciKutuphane.Models
{
    [Table("Yazarlar")]
    public class Yazar
    {
        public int id { get; set; }

        [StringLength(100)]
        public string AdSoyad { get; set; }

        public virtual ICollection<Kitap> Kitaplar { get; set; }
    }
}