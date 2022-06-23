using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace KampusIciKutuphane.Models
{
    [Table("KitapTurleri")]
    public class KitapTuru
    {
        public int id { get; set; }

        [StringLength(100)]
        public string Ad { get; set; }

        public virtual ICollection<Kitap> Kitaplar { get; set; }
    }
}