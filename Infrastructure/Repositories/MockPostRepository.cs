using Core.Models;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace Infrastructure.Repositories
{
  public class MockPostRepository : IPostRepository
  {
    private readonly AppDBContext _context;

    public MockPostRepository(AppDBContext context)
    {
      _context = context;
    }
    public async Task<PostModel> AddPostAsync(PostModel post)
    {
      await _context.Post.AddAsync(post);
      await _context.SaveChangesAsync();

      return post;
    }

    public async Task<PostModel?> DeletePostAsync(string id)
    {
      PostModel? post = await _context.Post.FindAsync(id);

      if (post != null)
      {
        _context.Post.Remove(post);
        await _context.SaveChangesAsync();
        return post;
      }

      return null;
    }

    public IEnumerable<PostModel> GetAllPosts()
    {
      return _context.Post
      .Include(x => x.Category)
      .ToList();
    }

    public async Task<IEnumerable<PostModel>?> GetFeaturedPostsAsync()
    {
      IEnumerable<PostModel>? featuredPosts = await _context.Post
      .Include(x => x.Category)
      .Where(x => x.IsFeatured)
      .OrderByDescending(x => x.UpdatedAt)
      .Take(5)
      .ToListAsync();

      return featuredPosts ?? null;
    }

        public async Task<IEnumerable<PostModel>?> GetPostsByCategoryIdAsync(string id)
    {
      IEnumerable<PostModel>? posts = await _context.Post
      .Include(x => x.Category)
      .Where(x => x.Category.CatID == id).ToListAsync();

      return posts ?? null;
    }

    public async Task<PostModel?> GetSinglePostAsync(string id)
    {
      PostModel? post = await _context.Post
      .Include(x => x.Category)
      .FirstOrDefaultAsync(x => x.ID == id);

      return post ?? null;
    }

    public async Task<PostModel?> ManagePostFeaturedAsync(string id)
    {
      PostModel? post = await _context.Post.FindAsync(id);

      if (post != null)
      {
        if (post.IsFeatured)
        {
          post.UpdatedAt = DateTime.Now;
          post.IsFeatured = false;
        }
        else 
        {
          post.UpdatedAt = DateTime.Now;
          post.IsFeatured = true;
        }

        await _context.SaveChangesAsync();

        return post;
      }

      return null;
    }

    public async Task<PostModel?> UpdatePostAsync(PostModel post)
    {
      PostModel? model = await _context.Post.FindAsync(post.ID);

      if (model != null)
      {
        model.Title = post.Title;
        model.Permalink = post.Permalink;
        model.PostImgPath = post.PostImgPath;
        model.Excerpt = post.Excerpt;
        model.Content = post.Content;
        model.Status = "updated";
        model.UpdatedAt = post.UpdatedAt;
        model.Category = new PostCategoryModel
        {
          CatID = post.Category.CatID,
          CatName = post.Category.CatName
        };

        await _context.SaveChangesAsync();

        return model;
      }

      return null;
    }
  }
}
