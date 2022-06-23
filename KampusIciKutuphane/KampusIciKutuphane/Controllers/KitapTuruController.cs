using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using KampusIciKutuphane;
using KampusIciKutuphane.Models;

namespace KampusIciKutuphane.Controllers
{
    
    public class KitapTuruController : ApiController
    {
        private Veritabani db = new Veritabani();

        // GET: api/KitapTuru
        public IHttpActionResult GetKitapTurleri()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var list = db.KitapTurleri.ToList();

            return Ok(list);
        }

        // GET: api/KitapTuru/5
        [ResponseType(typeof(KitapTuru))]
        public IHttpActionResult GetKitapTuru(int id)
        {
            KitapTuru kitapTuru = db.KitapTurleri.Find(id);
            if (kitapTuru == null)
            {
                return NotFound();
            }

            return Ok(kitapTuru);
        }

        // PUT: api/KitapTuru/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutKitapTuru(int id, KitapTuru kitapTuru)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != kitapTuru.id)
            {
                return BadRequest();
            }

            db.Entry(kitapTuru).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KitapTuruExists(id))
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

        // POST: api/KitapTuru
        [ResponseType(typeof(KitapTuru))]
        public IHttpActionResult PostKitapTuru(KitapTuru kitapTuru)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.KitapTurleri.Add(kitapTuru);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = kitapTuru.id }, kitapTuru);
        }

        // DELETE: api/KitapTuru/5
        [ResponseType(typeof(KitapTuru))]
        public IHttpActionResult DeleteKitapTuru(int id)
        {
            KitapTuru kitapTuru = db.KitapTurleri.Find(id);
            if (kitapTuru == null)
            {
                return NotFound();
            }

            if (db.Kitaplar.Any(k => k.TurId == kitapTuru.id))
            {
                return BadRequest("Sistemde bu türün kitapları olduğu için silemezsiniz.");
            }

            db.KitapTurleri.Remove(kitapTuru);
            db.SaveChanges();

            return Ok(kitapTuru);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool KitapTuruExists(int id)
        {
            return db.KitapTurleri.Count(e => e.id == id) > 0;
        }
    }
}