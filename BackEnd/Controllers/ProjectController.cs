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
    [Route("api/projects")]
    [ApiController]
    public class ProjectController : ControllerBase
    {

        private readonly IUser _repository;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        public ProjectController(IUser repository, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _repository = repository;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        // Projects Handling //
        [HttpGet]
        public ActionResult<IEnumerable<Project>> GetProjects()
        {
            var projects = _repository.GetAllProjects();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public ActionResult<IEnumerable<Task>> GetOneProject(int id)
        {
            var project = _repository.GetOneProject(id);
            return Ok(project);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("add")]
        public ActionResult<IEnumerable<Task>> AddProject(Project project)
        {
            var projectAdded = _repository.AddProject(project);
            return Ok(project);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPut("{id}")]
        public ActionResult<IEnumerable<Task>> EditProject(int id, Project project)
        {
            var projectAdded = _repository.EditProject(id, project);
            return Ok(project);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpDelete("{id}")]
        public IActionResult DeleteProject(int id)
        {
            _repository.DeleteProject(id);
            return Ok();
        }

        // TASKS HANDLING // 
        [HttpGet("{projectId}/tasks")]
        public ActionResult<IEnumerable<Task>> GetTasks(int projectId)
        {
            var tasks = _repository.GetAllTasks(projectId);
            var model = _mapper.Map<IList<TaskModel>>(tasks);
            return Ok(model);
        }

        [HttpGet("{projectId}/tasks/{taskId}")]
        public ActionResult<IEnumerable<Task>> GetOneTask(int projectId, int taskId)
        {
            var tasks = _repository.GetOneTask(projectId, taskId);
            var model = _mapper.Map<TaskModel>(tasks);
            return Ok(model);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("{projectId}/tasks/add")]
        public IActionResult AddTask(int projectId, Task task)
        {
            _repository.AddTask(projectId, task);
            return Ok();
        }

        [HttpPut("{projectId}/tasks/{taskId}")]
        public IActionResult EditTask(int projectId, int taskId, TaskModel task)
        {
            _repository.EditTask(projectId, taskId, task);
            return Ok();
        }

        [HttpDelete("{projectId}/tasks/{TaskId}")]
        public IActionResult DeleteTask(int projectId, int TaskId)
        {
            _repository.DeleteTask(projectId, TaskId);
            return Ok();
        }
    }
}