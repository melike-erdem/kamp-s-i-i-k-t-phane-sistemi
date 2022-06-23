using JWT;
using KampusIciKutuphane.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace KampusIciKutuphane.Controllers
{
    public class KimlikController: ApiController
    {
        private Veritabani db = new Veritabani();

        public IHttpActionResult GetOturumKontrol()
        {
            if (Request.Properties.ContainsKey("KullaniciId"))
            {
                var kullaniciId = (int)Request.Properties["KullaniciId"];
                var kullanici = db.Kullanicilar.Find(kullaniciId);
                if (kullanici != null)
                {
                    kullanici.Sifre = "";
                    return Ok(kullanici);
                }
            }

            return Unauthorized();
        }


        [AllowAnonymous]
        public IHttpActionResult PostOturumAc(Kullanici kullanici)
        {

            kullanici = db.Kullanicilar.Where(dbKullanici => dbKullanici.Eposta == kullanici.Eposta &&
              dbKullanici.Sifre == kullanici.Sifre).FirstOrDefault();

            if (kullanici != null)
            {

                var payload = new Dictionary<string, object>()
                    {
                        { "KullaniciId", kullanici.id},
                        { "OturumGecerli", true }
                    };

                var token = JsonWebToken.Encode(payload, WebApiApplication.GizliAnahtar, JwtHashAlgorithm.HS256);

                kullanici.Sifre = token;

                return Ok(kullanici);
            }

            return BadRequest("E-posta yada şifre yanlış.");
        }

        // POST: api/Kullanici
        [AllowAnonymous]
        [Route("api/Kimlik/KayitOl")]
        [ResponseType(typeof(Kullanici))]
        public IHttpActionResult PostKayitOl(Kullanici kullanici)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dbKullanici = db.Kullanicilar.Where(k => k.Eposta == kullanici.Eposta).FirstOrDefault();

            if (dbKullanici != null) {
                return BadRequest("Bu e-posta adresi ile daha önce bir hesap açılmış.");
            }

            db.Kullanicilar.Add(kullanici);
            db.SaveChanges();

            return Ok();
        }
    }
}