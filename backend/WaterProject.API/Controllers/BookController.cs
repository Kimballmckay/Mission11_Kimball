using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11_Kimball.API.Data;

namespace Mission11_Kimball.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortOrder = "")
        {
            var query = _bookContext.Books.AsQueryable();

            if (sortOrder == "asc")
            {
                query = query.OrderBy(b => b.Title);
            }
            else if (sortOrder == "desc")
            {
                query = query.OrderByDescending(b => b.Title);
            }

            var something = query
                .Skip((pageNum-1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = _bookContext.Books.Count();

            var someObject = new
            {
                Books = something,
                TotalNumBooks = totalNumBooks,
            };

            return Ok(someObject);
        }
    }
}
