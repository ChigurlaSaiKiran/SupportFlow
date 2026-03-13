using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using SupportFlow.Application.Interfaces;



namespace SupportFlow.API.Common;
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _http;

    public CurrentUserService(IHttpContextAccessor http)
    {
        _http = http;
    }
    public int UserId
    {
        get
        {
            // ✅ use "sub" or ClaimTypes.NameIdentifier directly
            var id = _http.HttpContext?.User?
                 .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(id, out var userId) ? userId : 0;
        }
    }

    //public int UserId
    //{
    //    get
    //    {
    //        var id = _http.HttpContext?
    //            .User?
    //            .FindFirst(ClaimTypes.NameIdentifier)?.Value;

    //        return id != null ? int.Parse(id) : 0;
    //    }
    //}
}
