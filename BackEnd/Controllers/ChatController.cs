using System.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using BackEnd.Hub;

namespace BackEnd.Controllers
{

    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<MainHub> _hubContext;
        public ChatController(IHubContext<MainHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [Route("send")]
        [HttpPost]
        public IActionResult SendRequest([FromBody] Model msg)
        {
            _hubContext.Clients.All.SendAsync("ReceiveOne", msg.user, msg.message, msg.created);
            return Ok(msg);
        }
    }
}