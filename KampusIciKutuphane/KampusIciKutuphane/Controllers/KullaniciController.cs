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
    public class KullaniciController : ApiController
    {
        private Veritabani db = new Veritabani();

        // GET: api/Kullanici
        //public IQueryable<Kullanici> GetKullanicilar()
        //{
        //    return db.Kullanicilar;
        //}

        // GET: api/Kullanici/5
        [ResponseType(typeof(Kullanici))]
        public IHttpActionResult GetKullanici(int id)
        {
            Kullanici kullanici = db.Kullanicilar.Find(id);
            if (kullanici == null)
            {
                return NotFound();
            }

            return Ok(kullanici);
        }

        // PUT: api/Kullanici/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutKullanici(int id, Kullanici kullanici)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != kullanici.id)
            {
                return BadRequest();
            }

            db.Entry(kullanici).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KullaniciExists(id))
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

        // POST: api/Kullanici
        [ResponseType(typeof(Kullanici))]
        public IHttpActionResult PostKullanici(Kullanici kullanici)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Kullanicilar.Add(kullanici);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = kullanici.id }, kullanici);
        }

        // DELETE: api/Kullanici/5
        [ResponseType(typeof(Kullanici))]
        public IHttpActionResult DeleteKullanici(int id)
        {
            Kullanici kullanici = db.Kullanicilar.Find(id);
            if (kullanici == null)
            {
                return NotFound();
            }

            db.Kullanicilar.Remove(kullanici);
            db.SaveChanges();

            return Ok(kullanici);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool KullaniciExists(int id)
        {
            return db.Kullanicilar.Count(e => e.id == id) > 0;
        }
    }
}