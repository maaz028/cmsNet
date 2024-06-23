using Core.Models;
using Infrastructure.Repositories;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace cmsNetApi.Controllers
{
  [Route("api/[controller]/[action]")]
  [ApiController]
  [Authorize]
  public class PostController : Controller
  {
    private readonly IPostRepository post;
    private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment iHosting;
    private readonly AppDBContext context;

    public PostController(IPostRepository post, Microsoft.AspNetCore.Hosting.IHostingEnvironment iHosting,
      AppDBContext context)
    {
      this.post = post;
      this.iHosting = iHosting;
      this.context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public ActionResult<IEnumerable<PostModel>> GetAllPosts()
    {
        IEnumerable<PostModel> posts = post.GetAllPosts();

        if (posts.Any())
          return Ok(posts);

        return Ok(Json(new { message = $"No Post available at the moments" }));
    }

    private async Task AddToDB(PostImageModel model)
    {
      await context.PostImage.AddAsync(model);
      await context.SaveChangesAsync();
    }

    [HttpGet]
    [AllowAnonymous]
    public ActionResult<IEnumerable<PostImageModel>> AllPostImages()
    {
        IEnumerable<PostImageModel> postImages = context.PostImage.ToList();

        if (postImages.Any())
          return Ok(postImages);

        return Ok(Json(new
        {
          message = "No Images available"
        }));
    }

    [HttpDelete]
    [AllowAnonymous]
    public async Task<ActionResult<PostImageModel>> DeletePostImageAsync(string id)
    {
      PostImageModel? postImage = await context.PostImage.FindAsync(id);

      if (postImage != null)
      {
        context.Remove(postImage);
        await context.SaveChangesAsync();
        System.IO.File.Delete(
          Path.Combine(iHosting.WebRootPath,$"images/post-images/{postImage.Name}")
        );
        return Ok(postImage);
      }

      return Ok(Json(new
      {
        message = $"No Image having ID: {id}"
      }));
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<PostImageModel>?> UploadPostImage([FromForm] PostImageModel model)
    {
        if (model != null)
        {
          string uploadFolder = Path.Combine("wwwroot", "images/post-images");
          string uniqueFilename = Guid.NewGuid() + " " + model.Name;
          string filepath = Path.Combine(uploadFolder, uniqueFilename);
          model.Photo.CopyTo(new FileStream(filepath, FileMode.Create));
          model.PhotoPath = "images/post-images/" + uniqueFilename;
          model.Name = uniqueFilename;
          await AddToDB(model);
          
          return model;
        }

        return null;
    }

    [HttpPost]
    public async Task<ActionResult<PostModel>?> AddPost([FromBody] PostBodyModel model)
    {
        if (model != null)
        {
          PostModel postModel = new()
          {
            Title = model.Title,
            Permalink = model.Permalink,
            Category = model.Category,
            PostImgPath = model.PostImgPath,
            Excerpt = model.Excerpt,
            Content = model.Content,
            UpdatedAt = DateTime.Now

          };

          await post.AddPostAsync(postModel);
          return Ok(postModel);
        }

        return null;
    }


    [HttpDelete]
    public async Task<ActionResult<PostModel>> DeletePost([FromQuery] string id)
    {
      PostModel? model = await post.DeletePostAsync(id);

      if (model != null)
      {
        return Ok(model);
      }

      return Ok(Json(new { message = $"No Post having ID: {id}" }));
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PostModel>> GetPost([FromQuery] string id)
    {
      PostModel? model = await post.GetSinglePostAsync(id);

      if (model != null)
      {
        return Ok(model);
      }

      return Ok(Json(new { message = $"No Post having ID: {id}" }));
    }

    [HttpPatch]
    public async Task<ActionResult<PostModel>> UpdatePost([FromBody] PostBodyModel model)
    {
      PostModel postModel = new()
      {
        ID = model.Id,
        Title = model.Title,
        Permalink = model.Permalink,
        Category = model.Category,
        PostImgPath = model.PostImgPath,
        Excerpt = model.Excerpt,
        Content = model.Content,
        UpdatedAt = DateTime.Now,
      };

      PostModel? result = await post.UpdatePostAsync(postModel);

      if (result != null)
      {
        return Ok(postModel);
      }

      return Ok(Json(new { message = $"No Post having ID: {model.Id}" }));

    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostModel>> ManagePostFeaturedAsync([FromRoute] string id)
    {
      PostModel? model = await post.ManagePostFeaturedAsync(id);

      if (model != null)
      {
        return Ok(model);
      }

      return Ok(new { Message = $"No Post having ID: {id}" });
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PostModel>>> GetFeaturedPostsAsync()
    {
      IEnumerable<PostModel>? posts = await post.GetFeaturedPostsAsync();

      if (post != null)
      {
        return Ok(posts);
      }

      return Ok(new { Message = $"No Featureds Posts available" });
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PostModel>>> GetPostsByCategoryAsync([FromRoute] string id )
    {
      IEnumerable<PostModel>? posts = await post.GetPostsByCategoryIdAsync(id);

      if (post != null)
      {
        return Ok(posts);
      }

      return Ok(new { Message = $"No Post having ID: {id}" });
    }


  }
}
