using Core.Models;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace cmsNetApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class CategoryController : Controller
  {
    private readonly ICategoryRepository category;
    private readonly AppDBContext context;

    public CategoryController(ICategoryRepository category, AppDBContext context)
    {
      this.category = category;
      this.context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("Categories")]
    public ActionResult<IEnumerable<CategoryModel>> GetCategories()
    {
      IEnumerable<CategoryModel> categories = category.GetAllCategories();

      if (categories.Any())
        return Ok(categories);

      return Ok(new ApiExceptionResponse(404));
    }
    private async Task<CategoryModel> IsCategoryAvailable(string name)
    {
      return await context.Category.FirstOrDefaultAsync(c => c.Name == name);
    }

    [HttpPost]
    [ProducesResponseType(typeof(CategoryModel), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CategoryModel>> CreateCategory([FromBody] CategoryBodyModel model)
    {
      CategoryModel isCategoryAvailable = await IsCategoryAvailable(model.Name.ToLower().Trim());

      if (isCategoryAvailable is not null)
      {
        return Ok(new ApiExceptionResponse(409));
      }

      CategoryModel result = await category.AddCategoryAsync(new CategoryModel()
      {
        Name = model.Name.ToLower().Trim(),
        UpdatedDate = DateTime.Now
      });

      if (result is null)
        return BadRequest(new ApiExceptionResponse(500));

      return CreatedAtAction("CreateCategory", result);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<CategoryModel>> DeleteCategory([FromRoute] string id)
    {
      CategoryModel? result = await category.DeleteCategoryAsync(id);

      if (result is null)
        return NotFound(new ApiExceptionResponse(404));

      return Ok(new ApiExceptionResponse(204));
    }

    [HttpPatch]
    [ProducesResponseType(typeof(CategoryModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoryModel>> UpdateCategory([FromBody] CategoryBodyModel model)
    {
      CategoryModel isCategoryAvailable = await IsCategoryAvailable(model.Name.ToLower().Trim());

      if (isCategoryAvailable is not null)
      {
        return Ok(new ApiExceptionResponse(409));
      }

      CategoryModel? result = await category.UpdateCategoryAsync(new CategoryModel()
      {
        ID = model.ID,
        Name = model.Name.ToLower().Trim(),
        UpdatedDate = DateTime.Now
      });

      if (result is null)
      {
        return NotFound(new ApiExceptionResponse(404));
      }

      return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(CategoryModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoryModel?>> GetSingleCategoryAsync(string id)
    {
      CategoryModel? model = await category.GetSingleCategory(id);

      if (model is null)
      {
        return NotFound(new ApiExceptionResponse(404));
      }

      return Ok(model);
    }
  }
}
