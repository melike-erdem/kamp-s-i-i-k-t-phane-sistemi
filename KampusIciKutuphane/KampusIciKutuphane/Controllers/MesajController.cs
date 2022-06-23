using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using KampusIciKutuphane;
using KampusIciKutuphane.Models;

namespace KampusIciKutuphane.Controllers
{
    public class MesajController : ApiController
    {
        private Veritabani db = new Veritabani();

        class MesajDTO
        {
            public int id;
            public string Kimden;
            public bool Okunmadi;
            public DateTime Tarih;
        }

        [NonAction]
        public Mesaj EkBilgiDoldur(Mesaj mesaj)
        {

            var kimden = db.Kullanicilar.Find(mesaj.KimdenId);

            mesaj.KimdenAdSoyad = kimden.AdSoyad;

            return mesaj;
        }

        [NonAction]
        public List<Mesaj> EkBilgileriDoldur(List<Mesaj> mesajlar)
        {
            for (int i = 0; i < mesajlar.Count; i++)
            {
                mesajlar[i] = EkBilgiDoldur(mesajlar[i]);
            }

            return mesajlar;
        }

        // GET: api/Mesaj
        public IHttpActionResult GetOkunmamisMesajSayisi(string okunmamis)
        {
            var kullaniciId = (int)Request.Properties["KullaniciId"];
            var kullanici = db.Kullanicilar.Find(kullaniciId);
            if (kullanici != null)
            {
                var okunmamisMesajSayisi = db.Mesajlar.Where(m => m.KimeId == kullaniciId && !m.Okundu)
                    .Count();

                return Ok(okunmamisMesajSayisi);
            }

            return Unauthorized();
        }

            // GET: api/Mesaj
            public IHttpActionResult GetMesajGonderenler()
        {
            var liste = new List<MesajDTO>();

            var kullaniciId = (int)Request.Properties["KullaniciId"];
            var kullanici = db.Kullanicilar.Find(kullaniciId);
            if (kullanici != null)
            {
                var mesajlar = db.Mesajlar.Where(m => m.KimeId == kullaniciId)
                    .GroupBy(m => m.KimdenId)
                    .Select(g => new MesajDTO {
                        id = g.Key,
                        Kimden = g.Select(m => m.Kimden.AdSoyad).FirstOrDefault(),
                        Okunmadi = g.Any(m => !m.Okundu),
                        Tarih = g.OrderByDescending(m=>m.GonderimTarihi).Select(m => m.GonderimTarihi).FirstOrDefault()
                    }).ToList();
                liste = mesajlar;
            }
            
            return Ok(liste);
        }

        // GET: api/Mesaj/5
        [ResponseType(typeof(Mesaj))]
        public IHttpActionResult GetMesaj(int id)
        {
            var liste = new List<Mesaj>();

            var kullaniciId = (int)Request.Properties["KullaniciId"];
            var kullanici = db.Kullanicilar.Find(kullaniciId);
            if (kullanici != null)
            {

                var mesajlar = db.Mesajlar.Where(m => 
                (m.KimdenId == id && m.KimeId == kullaniciId) ||
                (m.KimdenId == kullaniciId && m.KimeId == id))
                    .OrderBy(m=>m.GonderimTarihi).ToList();

                foreach (var mesaj in mesajlar)
                {
                    if (mesaj.KimeId == kullaniciId)
                        mesaj.Okundu = true;
                }

                db.SaveChanges();

                liste = EkBilgileriDoldur(mesajlar);
            }



            return Ok(liste);
        }

        // PUT: api/Mesaj/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutMesaj(int id, Mesaj mesaj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != mesaj.id)
            {
                return BadRequest();
            }

            db.Entry(mesaj).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MesajExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Mesaj
        [ResponseType(typeof(Mesaj))]
        public IHttpActionResult PostMesaj(Mesaj mesaj)
        {
            mesaj.GonderimTarihi = DateTime.Now;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var kullaniciId = (int)Request.Properties["KullaniciId"];
            var kullanici = db.Kullanicilar.Find(kullaniciId);
            if (kullanici != null)
            {

                mesaj.KimdenId = kullanici.id;
                mesaj.Okundu = false;

                mesaj = db.Mesajlar.Add(mesaj);
                db.SaveChanges();

                return Ok(mesaj);
            }

            return Unauthorized();
        }

        // DELETE: api/Mesaj/5
        [ResponseType(typeof(Mesaj))]
        public IHttpActionResult DeleteMesaj(int id)
        {

            var kullaniciId = (int)Request.Properties["KullaniciId"];
            var kullanici = db.Kullanicilar.Find(kullaniciId);
            if (kullanici != null)
            {
                var silinecekler = db.Mesajlar.Where(m =>
                (m.KimdenId == id && m.KimeId == kullaniciId) ||
                (m.KimdenId == kullaniciId && m.KimeId == id))
                    .ToList();

                foreach (var mesaj in silinecekler)
                {
                    db.Mesajlar.Remove(mesaj);
                }
                db.SaveChanges();

                return Ok();
            }
            return Unauthorized();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MesajExists(int id)
        {
            return db.Mesajlar.Count(e => e.id == id) > 0;
        }
    }
}