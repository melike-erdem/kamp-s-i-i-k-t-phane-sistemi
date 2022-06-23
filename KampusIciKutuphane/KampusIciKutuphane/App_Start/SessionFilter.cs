using JWT;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace KampusIciKutuphane
{

    public class SessionFilter : AuthorizeAttribute, IActionFilter
    {

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var isAnonymous = isAllowAnonymousAttributeGiven(actionContext);

            if (isAnonymous || AuthorizeRequest(actionContext))
                return;

            HandleUnauthorizedRequest(actionContext);
        }

        private bool AuthorizeRequest(HttpActionContext actionContext)
        {
            HttpContextWrapper httpContext = (HttpContextWrapper)actionContext.Request.Properties["MS_HttpContext"];
            var token = httpContext.Request.Headers["Authorization"];
            
            if (token == null) return false;

            var payload = JsonWebToken.DecodeToObject(token, WebApiApplication.GizliAnahtar) as Dictionary<string, object>;

            if (payload.ContainsKey("OturumGecerli") && payload.ContainsKey("KullaniciId"))
            {
                var oturumGecerli = (bool)payload["OturumGecerli"];
                var kullaniciId = (int)payload["KullaniciId"];

                if (oturumGecerli)
                {
                    actionContext.Request.Properties["KullaniciId"] = kullaniciId;
                    return true;
                }
            }


            return false;
        }

        private static bool isAllowAnonymousAttributeGiven(HttpActionContext actionContext)
        {
            Contract.Assert(actionContext != null);

            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                   || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }

        public async Task<HttpResponseMessage> ExecuteActionFilterAsync(HttpActionContext actionContext, CancellationToken cancellationToken, Func<Task<HttpResponseMessage>> continuation)
        {
            HttpResponseMessage response = await continuation();
            
            return response;
        }
    }
}
