using Core.Models;
using Core.Interfaces;
using System.Security.Cryptography.X509Certificates;


namespace Infrastructure.Repositories
{
    public class MockCategoryRepository : ICategoryRepository
  {
    private readonly AppDBContext context;

    public MockCategoryRepository(AppDBContext context)
    {
      this.context = context;
    }
    public async Task<CategoryModel> AddCategoryAsync(CategoryModel category)
    {
      await context.Category.AddAsync(category);
      await context.SaveChangesAsync();

      return category;
    }

    public async Task<CategoryModel?> DeleteCategoryAsync(string id)
    {
      CategoryModel model = await context.Category.FindAsync(id);

      if (model != null)
      {
        context.Category.Remove(model);
        await context.SaveChangesAsync();

        return model;
      }

      return null;
    }

    public IEnumerable<CategoryModel> GetAllCategories()
    {
      return context.Category.OrderByDescending(x => x.CreatedDate).ToList();
    }

    public async Task<CategoryModel> GetCategoryAsync(string id)
    {
      CategoryModel category = await context.Category.FindAsync(id);

      return category;
    }

        public async Task<CategoryModel?> GetSingleCategory(string id)
        {
            CategoryModel? category = await context.Category.FindAsync(id);

            if (category != null)
            {
              return category;
            }

            return null;
        }

        public async Task<CategoryModel?> UpdateCategoryAsync(CategoryModel model)
    {
      CategoryModel category = await context.Category.FindAsync(model.ID);
      
      if (category != null)
      {
        category.Name = model.Name;
        category.UpdatedDate = model.UpdatedDate;
        await context.SaveChangesAsync();
        return model;
      }

        return null;
    }
  }
}
