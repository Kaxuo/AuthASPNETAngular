using System;
using System.Collections.Generic;
using AutoMapper;
using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using BackEnd.Exceptions;
using BackEnd.Data.Interface;

namespace BackEnd.Controllers
{

    [RequireHttps]
    [Authorize]
    [Route("api/projects")]
    [ApiController]
    public class ProjectController : ControllerBase
    {

        private readonly IProjects _repository;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;
        public ProjectController(IProjects repository, IMapper mapper, IOptions<AppSettings> appSettings)
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
            try
            {
                var project = _repository.GetOneProject(id);
                return Ok(project);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
            try
            {
                var projectAdded = _repository.EditProject(id, project);
                return Ok(project);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = Role.Admin)]
        [HttpDelete("{id}")]
        public IActionResult DeleteProject(int id)
        {
            try
            {
                _repository.DeleteProject(id);
                return Ok();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // TASKS HANDLING // 
        [HttpGet("{projectId}/tasks")]
        public ActionResult<IEnumerable<Task>> GetTasks(int projectId)
        {
            try
            {
                var tasks = _repository.GetAllTasks(projectId);
                var model = _mapper.Map<IList<TaskModel>>(tasks);
                return Ok(model);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{projectId}/tasks/{taskId}")]
        public ActionResult<IEnumerable<Task>> GetOneTask(int projectId, int taskId)
        {
            try
            {
                var tasks = _repository.GetOneTask(projectId, taskId);
                var model = _mapper.Map<TaskModel>(tasks);
                return Ok(model);
            }
            catch (AppException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("{projectId}/tasks/add")]
        public IActionResult AddTask(int projectId, Task task)
        {
            try
            {
                _repository.AddTask(projectId, task);
                return Ok();
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{projectId}/tasks/{taskId}")]
        public IActionResult EditTask(int projectId, int taskId, TaskModel task)
        {
            try
            {
                _repository.EditTask(projectId, taskId, task);
                return Ok();
            }
            catch (AppException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{projectId}/tasks/{TaskId}")]
        public IActionResult DeleteTask(int projectId, int TaskId)
        {
            try
            {
                _repository.DeleteTask(projectId, TaskId);
                return Ok();
            }
            catch (AppException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}