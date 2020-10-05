using System;
using System.Text;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace BackEnd.Controllers
{
    [RequireHttps]
    [Authorize]
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUser _repository;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        public UserController(IUser repository, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _repository = repository;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAll()
        {
            var users = _repository.GetAllUsers();
            var model = _mapper.Map<IList<UserModel>>(users);
            return Ok(model);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            var user = _mapper.Map<User>(model);
            try
            {
                _repository.CreateUser(user, model.Password);
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                    }),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);
                return Ok(new
                {
                    Token = tokenString
                });
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticateModels model)
        {
            var user = _repository.Authenticate(model.Username, model.Password);
            if (user == null)
                return BadRequest(new { message = " Username or password is incorrect" });

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return Ok(new
            {
                Id = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = tokenString
            });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _repository.GetUserById(id);
            var model = _mapper.Map<UserModel>(user);
            return Ok(model);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UserModel model)
        {
            // map model to User and set Id
            var user = _mapper.Map<User>(model);
            user.Id = id;
            try
            {
                _repository.Update(user);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _repository.Delete(id);
            return Ok();
        }

        // Projects Handling //

        

        // TASKS HANDLING // 
        [HttpGet("{id}/tasks")]
        public ActionResult<IEnumerable<Task>> GetTasks(int id)
        {
            var tasks = _repository.GetAllTasks(id);
            var model = _mapper.Map<IList<TaskModel>>(tasks);
            return Ok(model);
        }

        [HttpGet("{id}/tasks/{taskId}")]
        public ActionResult<IEnumerable<Task>> GetOneTask(int id, int taskId)
        {
            var tasks = _repository.GetOneTask(id, taskId);
            var model = _mapper.Map<TaskModel>(tasks);
            return Ok(model);
        }

        [HttpPost("{id}/tasks/add")]
        public IActionResult AddTask(int id, Task task)
        {
            _repository.AddTask(id, task);
            return Ok();
        }

        [HttpPut("{id}/tasks/{taskId}")]
        public IActionResult EditTask(int id, int taskId, TaskModel task)
        {
            _repository.EditTask(id, taskId, task);
            return Ok();
        }

        [HttpDelete("{id}/tasks/{TaskId}")]
        public IActionResult DeleteTask(int id, int TaskId)
        {
            _repository.DeleteTask(id, TaskId);
            return Ok();
        }
    }
}