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
    public class KitapController : ApiController
    {
        private Veritabani db = new Veritabani();

        [NonAction]
        public Kitap EkBilgiDoldur(Kitap kitap)
        {
            var tur = db.KitapTurleri.Find(kitap.TurId);
            var yazar = db.Yazarlar.Find(kitap.YazarId);
            var sahibi = db.Kullanicilar.Find(kitap.SahipId);

            kitap.TurAdi = tur.Ad;
            kitap.YazarAdSoyad = yazar.AdSoyad;
            kitap.SahibiAdSoyad = sahibi.AdSoyad;

            kitap.Sahibi = null;
            kitap.Turu = null;
            kitap.Yazar = null;

            return kitap;
        }

        [NonAction]
        public List<Kitap> EkBilgileriDoldur(List<Kitap> kitaplar)
        {
            for (int i = 0; i < kitaplar.Count; i++)
            {
                kitaplar[i] = EkBilgiDoldur(kitaplar[i]);
            }
            return kitaplar;
        }


        // GET: api/Kitap
        public IHttpActionResult GetKitaplar()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var liste = new List<Kitap>();

            var kullaniciId = (int)Request.Properties["KullaniciId"];
            var kullanici = db.Kullanicilar.Find(kullaniciId);
            if (kullanici != null)
            {
                liste = db.Kitaplar.Where(k => k.SahipId == kullaniciId).ToList();
            }

            return Ok(EkBilgileriDoldur(liste));
        }

        public IHttpActionResult GetKitapBul(string aranan, int tur)
        {
            db.Configuration.ProxyCreationEnabled = false;

            var liste = new List<Kitap>();

            var kullaniciId = (int)Request.Properties["KullaniciId"];
            var kullanici = db.Kullanicilar.Find(kullaniciId);
            if (kullanici != null)
            {
                IQueryable<Kitap> sorgu = db.Kitaplar;

                sorgu = sorgu.Where(
                    k => 
                    k.Aktif == true && 
                    (k.Aciklama.Contains(aranan) || k.Ad.Contains(aranan))
                    );

                if (tur != 0)
                    sorgu = sorgu.Where(k => k.TurId == tur);

                liste = sorgu.ToList();
            }

            return Ok(EkBilgileriDoldur(liste));
        }

        // GET: api/Kitap/5
        [ResponseType(typeof(Kitap))]
        public IHttpActionResult GetKitap(int id)
        {
            Kitap kitap = db.Kitaplar.Find(id);
            if (kitap == null)
            {
                return NotFound();
            }

            return Ok(kitap);
        }

        // PUT: api/Kitap/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutKitap(int id, Kitap kitap)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != kitap.id)
            {
                return BadRequest();
            }

            db.Entry(kitap).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KitapExists(id))
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

        // POST: api/Kitap
        [ResponseType(typeof(Kitap))]
        public IHttpActionResult PostKitap(Kitap kitap)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if(string.IsNullOrEmpty(kitap.Ad) || string.IsNullOrEmpty(kitap.Aciklama))
            {
                return BadRequest("Kitabın adını ve açıklamasını yazmak zorundasınız.");
            }

            if(!kitap.Takas && kitap.Fiyat <= 0)
            {
                return BadRequest("Kitap ya takas edilebilmeli yada fiyatı olmalı.");
            }

            var kullaniciId = (int)Request.Properties["KullaniciId"];

            kitap.SahipId = kullaniciId;

            db.Kitaplar.Add(kitap);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = kitap.id }, kitap);
        }

        // DELETE: api/Kitap/5
        [ResponseType(typeof(Kitap))]
        public IHttpActionResult DeleteKitap(int id)
        {
            Kitap kitap = db.Kitaplar.Find(id);
            if (kitap == null)
            {
                return NotFound();
            }

            db.Kitaplar.Remove(kitap);
            db.SaveChanges();

            return Ok(kitap);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool KitapExists(int id)
        {
            return db.Kitaplar.Count(e => e.id == id) > 0;
        }
    }
}