using Core.Models;

namespace Core.Interfaces
{
  public interface IPostRepository
  {
    IEnumerable<PostModel> GetAllPosts();

    Task<PostModel?> GetSinglePostAsync(string id);

    Task<PostModel> AddPostAsync(PostModel post);

    Task<PostModel?> UpdatePostAsync(PostModel post);

    Task<PostModel?> DeletePostAsync(string id);

    Task<IEnumerable<PostModel>?> GetPostsByCategoryIdAsync(string id);

    Task<IEnumerable<PostModel>?> GetFeaturedPostsAsync();

    Task<PostModel?> ManagePostFeaturedAsync(string id); 


  }
}
