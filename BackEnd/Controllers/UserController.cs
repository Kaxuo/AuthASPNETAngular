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
    [Route("api")]
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
        [HttpGet("users")]
        public ActionResult<IEnumerable<User>> GetAll()
        {
            var users = _repository.GetAllUsers();
            var model = _mapper.Map<IList<UserModel>>(users);
            return Ok(model);
        }

        [AllowAnonymous]
        [HttpPost("users/register")]
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
        [HttpPost("users/authenticate")]
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

        [HttpGet("users/{id}")]
        public IActionResult GetById(int id)
        {
            var user = _repository.GetUserById(id);
            var model = _mapper.Map<UserModel>(user);
            return Ok(model);
        }

        [HttpPut("users/{id}")]
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
        [Authorize(Roles = Role.Admin)]
        [HttpDelete("users/{id}")]
        public IActionResult Delete(int id)
        {
            _repository.Delete(id);
            return Ok();
        }

        [HttpGet("users/{id}/tasks")]
        public ActionResult<IEnumerable<Task>> GetTasksPerUsers(int id)
        {
            var tasks = _repository.GetAllTasks(id);
            var model = _mapper.Map<IList<TaskModel>>(tasks);
            return Ok(model);
        }

        // Projects Handling //
        [HttpGet("projects")]
        public ActionResult<IEnumerable<Project>> GetProjects()
        {
            var projects = _repository.GetAllProjects();
            return Ok(projects);
        }

        [HttpGet("projects/{id}")]
        public ActionResult<IEnumerable<Task>> GetOneTask(int id)
        {
            var project = _repository.GetOneProject(id);
            return Ok(project);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("projects/add")]
        public ActionResult<IEnumerable<Task>> AddProject(Project project)
        {
            var projectAdded = _repository.AddProject(project);
            return Ok(project);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPut("projects/{id}")]
        public ActionResult<IEnumerable<Task>> EditProject(int id, Project project)
        {
            var projectAdded = _repository.EditProject(id, project);
            return Ok(project);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpDelete("projects/{id}")]
        public IActionResult DeleteProject(int id)
        {
            _repository.DeleteProject(id);
            return Ok();
        }

        // TASKS HANDLING // 
        [HttpGet("projects/{projectId}/tasks")]
        public ActionResult<IEnumerable<Task>> GetTasks(int projectId)
        {
            var tasks = _repository.GetAllTasks(projectId);
            var model = _mapper.Map<IList<TaskModel>>(tasks);
            return Ok(model);
        }

        [HttpGet("projects/{projectId}/tasks/{taskId}")]
        public ActionResult<IEnumerable<Task>> GetOneTask(int projectId, int taskId)
        {
            var tasks = _repository.GetOneTask(projectId, taskId);
            var model = _mapper.Map<TaskModel>(tasks);
            return Ok(model);
        }

        [HttpPost("projects/{projectId}/tasks/add")]
        public IActionResult AddTask(int projectId, Task task)
        {
            _repository.AddTask(projectId, task);
            return Ok();
        }

        [HttpPut("projects/{projectId}/tasks/{taskId}")]
        public IActionResult EditTask(int projectId, int taskId, TaskModel task)
        {
            _repository.EditTask(projectId, taskId, task);
            return Ok();
        }

        [HttpDelete("projects/{projectId}/tasks/{TaskId}")]
        public IActionResult DeleteTask(int projectId, int TaskId)
        {
            _repository.DeleteTask(projectId, TaskId);
            return Ok();
        }
    }
}