using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query;
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
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, [FromQuery] List<string>? bookCategories=null, string? sortOrder = "")
        {
            var query = _bookContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            var totalNumBooks = query.Count();

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

            var someObject = new
            {
                Books = something,
                TotalNumBooks = totalNumBooks,
            };

            return Ok(someObject);
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories ()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookID}")]
        public IActionResult UpdateBook(int bookID, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookID);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookID}")]
        public IActionResult DeleteBook(int bookID)
        {
            var book = _bookContext.Books.Find(bookID);

            if (book == null)
            {
                return NotFound(new {message = "Book not found"});
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
