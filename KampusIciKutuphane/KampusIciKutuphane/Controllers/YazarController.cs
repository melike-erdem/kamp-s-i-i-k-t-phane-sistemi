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
    public class YazarController : ApiController
    {
        private Veritabani db = new Veritabani();

        // GET: api/Yazar
        public IHttpActionResult GetYazarlar()
        {
            db.Configuration.ProxyCreationEnabled = false;
            return Ok(db.Yazarlar.ToList());
        }

        // GET: api/Yazar/5
        [ResponseType(typeof(Yazar))]
        public IHttpActionResult GetYazar(int id)
        {
            Yazar yazar = db.Yazarlar.Find(id);
            if (yazar == null)
            {
                return NotFound();
            }

            return Ok(yazar);
        }

        // PUT: api/Yazar/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutYazar(int id, Yazar yazar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != yazar.id)
            {
                return BadRequest();
            }

            db.Entry(yazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!YazarExists(id))
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

        // POST: api/Yazar
        [ResponseType(typeof(Yazar))]
        public IHttpActionResult PostYazar(Yazar yazar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Yazarlar.Add(yazar);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = yazar.id }, yazar);
        }

        // DELETE: api/Yazar/5
        [ResponseType(typeof(Yazar))]
        public IHttpActionResult DeleteYazar(int id)
        {
            Yazar yazar = db.Yazarlar.Find(id);
            if (yazar == null)
            {
                return NotFound();
            }

            if (db.Kitaplar.Any(k => k.YazarId == yazar.id))
            {
                return BadRequest("Sistamde bu yazarın kitapları olduğu için silemezsiniz.");
            }

            db.Yazarlar.Remove(yazar);
            db.SaveChanges();

            return Ok(yazar);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool YazarExists(int id)
        {
            return db.Yazarlar.Count(e => e.id == id) > 0;
        }
    }
}