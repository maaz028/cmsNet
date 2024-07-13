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

      return Ok(new { msg = "No Categories available at the moment" });
    }
    private async Task<CategoryModel> IsCategoryAvailable(string name)
    {
      return await context.Category.FirstOrDefaultAsync(c => c.Name == name);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryModel>> CreateCategory([FromBody] CategoryBodyModel model)
    {
      CategoryModel isCategoryAvailable = await IsCategoryAvailable(model.Name.ToLower().Trim());

      if (isCategoryAvailable is {})
      {
        return Ok(new { available = true });
      }

      CategoryModel result = await category.AddCategoryAsync(new CategoryModel()
      {
        Name = model.Name.ToLower().Trim(),
        UpdatedDate = DateTime.Now
      });

      if (result is not {})
        return BadRequest(Json(new { msg = "server error" }));

      return CreatedAtAction("CreateCategory", result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<CategoryModel>> DeleteCategory([FromRoute] string id)
    {
      CategoryModel? result = await category.DeleteCategoryAsync(id);

      if (result is not {})
        return BadRequest(Json(new { msg = $"No Category found having ID: {id}" }));

      return Ok(result);
    }

    [HttpPatch]
    public async Task<ActionResult<CategoryModel>> UpdateCategory([FromBody] CategoryBodyModel model)
    {
      CategoryModel isCategoryAvailable = await IsCategoryAvailable(model.Name.ToLower().Trim());

      if (isCategoryAvailable is {})
      {
        return Ok(new { available = true });
      }

      CategoryModel? result = await category.UpdateCategoryAsync(new CategoryModel()
      {
        ID = model.ID,
        Name = model.Name.ToLower().Trim(),
        UpdatedDate = DateTime.Now
      });

      if (result is not {})
      {
        return BadRequest(new
        {
          msg = $"No Category found having ID: {model.ID}"
        });
      }

      return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<CategoryModel?>> GetSingleCategoryAsync(string id)
    {
      CategoryModel? model = await category.GetSingleCategory(id);

      if (model is {})
      {
        return Ok(new
        {
          msg = $"No Category found having ID: {id}"
        });
      }

      return model;
    }
  }
}
