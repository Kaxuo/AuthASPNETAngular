using System.Collections.Generic;
using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUser _repository;

        public UserController(IUser repository)
        {
            _repository = repository;
        }
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAll()
        {
            var items = _repository.GetAllUsers();
            return Ok(items);
        }
    }
}