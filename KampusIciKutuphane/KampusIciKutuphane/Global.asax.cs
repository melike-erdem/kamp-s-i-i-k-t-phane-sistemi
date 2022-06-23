using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.SessionState;

namespace KampusIciKutuphane
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        public static string GizliAnahtar = "QWEasd123!";

        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);

            if (!Database.Exists("Veritabani"))
            {
                using (var veritabani = new Veritabani())
                {
                    Database.SetInitializer(new CreateDatabaseIfNotExists<Veritabani>());
                    veritabani.Database.Initialize(true);

                    veritabani.Kitaplar.Find(1);
                }
            }
        }

    }
}
