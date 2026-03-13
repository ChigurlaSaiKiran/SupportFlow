//using Microsoft.AspNetCore.Http;
//using System.Security.Claims;

//namespace SupportFlow.Application.Common;

//public interface ICurrentUserService
//{
//    int UserId { get; }
//}

//public class CurrentUserService : ICurrentUserService
//{
//    private readonly IHttpContextAccessor _http;

//    public CurrentUserService(IHttpContextAccessor http)
//    {
//        _http = http;
//    }

//    public int UserId
//    {
//        get
//        {
//            var id = _http.HttpContext?
//                .User?
//                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

//            return id != null ? int.Parse(id) : 0;
//        }
//    }
//}
