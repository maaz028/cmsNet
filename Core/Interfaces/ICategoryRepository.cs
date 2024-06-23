using Core.Models;

namespace Core.Interfaces
{
  public interface ICategoryRepository
  {
    Task<CategoryModel> AddCategoryAsync(CategoryModel category);

    Task<CategoryModel?> UpdateCategoryAsync(CategoryModel category);

    Task<CategoryModel?> DeleteCategoryAsync(string id);

    IEnumerable<CategoryModel> GetAllCategories();

    Task<CategoryModel> GetCategoryAsync(string id);

    Task<CategoryModel?> GetSingleCategory(string id);

  }
}
