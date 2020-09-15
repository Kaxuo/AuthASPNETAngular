using System.Collections.Generic;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MongoAuthServices _users;
        public UserController(MongoAuthServices services)
        {
            _users = services;
        }

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetEverything()
        {
            var items = _users.Get();
            return Ok(items);
        }
    }
}