using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginsController : ControllerBase
    {
        private readonly Data.CredContext _context;

        public LoginsController(Data.CredContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoginActivity>>> GetAll()
        {
            return await _context.LoginActivities.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LoginActivity>> GetById(Guid id)
        {
            var login = await _context.LoginActivities.FindAsync(id);
            return login == null ? NotFound() : Ok(login);
        }

        [HttpPost]
        public async Task<ActionResult<LoginActivity>> Create(LoginActivity login)
        {
            login.Id = Guid.NewGuid();
            _context.LoginActivities.Add(login);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = login.Id }, login);
        }
    }
}
