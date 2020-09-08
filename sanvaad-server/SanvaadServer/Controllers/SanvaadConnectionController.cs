using System.Threading.Tasks;

using SanvaadServer.Hubs;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace SanvaadServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanvaadConnectionController : ControllerBase
    {
        private readonly IHubContext<SanvaadHub, ISanvaadHub> _sanvaadHub = null;
        public SanvaadConnectionController(IHubContext<SanvaadHub, ISanvaadHub> sanvaadHub)
        {
            _sanvaadHub = sanvaadHub;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(new { Message = "Request Completed" });
        }
    }
}
