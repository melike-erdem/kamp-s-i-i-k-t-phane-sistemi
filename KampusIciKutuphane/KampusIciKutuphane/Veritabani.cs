using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;

namespace KampusIciKutuphane
{
    public class Veritabani : DbContext
    {
        // Your context has been configured to use a 'Veritabani' connection string from your application's 
        // configuration file (App.config or Web.config). By default, this connection string targets the 
        // 'KampusIciKutuphane.Veritabani' database on your LocalDb instance. 
        // 
        // If you wish to target a different database and/or database provider, modify the 'Veritabani' 
        // connection string in the application configuration file.
        public Veritabani()
            : base("name=Veritabani")
        {
        }

        // Add a DbSet for each entity type that you want to include in your model. For more information 
        // on configuring and using a Code First model, see http://go.microsoft.com/fwlink/?LinkId=390109.

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();

            base.OnModelCreating(modelBuilder);
        }

        public virtual DbSet<Models.Kullanici> Kullanicilar { get; set; }
        public virtual DbSet<Models.Kitap> Kitaplar { get; set; }
        public virtual DbSet<Models.KitapTuru> KitapTurleri { get; set; }
        public virtual DbSet<Models.Mesaj> Mesajlar { get; set; }
        public virtual DbSet<Models.Yazar> Yazarlar { get; set; }
    }

    //public class MyEntity
    //{
    //    public int Id { get; set; }
    //    public string Name { get; set; }
    //}
}