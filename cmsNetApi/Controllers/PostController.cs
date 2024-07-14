using Core.Models;
using Infrastructure.Repositories;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace cmsNetApi.Controllers
{
  [Route("api/[controller]")]
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
    [Route("Posts")]
    public ActionResult<IEnumerable<PostModel>> GetAllPosts()
    {
      IEnumerable<PostModel> posts = post.GetAllPosts();

      if (posts.Any())
        return Ok(posts);

      return Ok(new ApiExceptionResponse(404));
    }

    private async Task AddToDB(PostImageModel model)
    {
      await context.PostImage.AddAsync(model);
      await context.SaveChangesAsync();
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("Post-Images")]
    [ProducesResponseType(typeof(PostImageModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PostImageModel>>> AllPostImages()
    {
      IEnumerable<PostImageModel> postImages = await context.PostImage.ToListAsync();

      if (postImages.Any())
        return Ok(postImages);

      return Ok(new ApiExceptionResponse(404));
    }

    [HttpDelete]
    [AllowAnonymous]
    [Route("Delete-Post-Image")]
    [ProducesResponseType(typeof(PostImageModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<PostImageModel>> DeletePostImageAsync(string id)
    {
      PostImageModel? postImage = await context.PostImage.FindAsync(id);

      if (postImage is not null)
      {
        context.Remove(postImage);
        await context.SaveChangesAsync();
        System.IO.File.Delete(
          Path.Combine(iHosting.WebRootPath, $"images/post-images/{postImage.Name}")
        );
        return Ok(postImage);
      }

      return Ok(new ApiExceptionResponse(404));
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [Route("Upload-Post-Image")]
    [ProducesResponseType(typeof(PostImageModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PostImageModel>?> UploadPostImage([FromForm] PostImageModel model)
    {
      if (model is not null)
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

      return BadRequest(new ApiExceptionResponse(500));
    }

    [HttpPost]
    [ProducesResponseType(typeof(PostModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PostModel>?> AddPost([FromBody] PostBodyModel model)
    {
      if (model is not null)
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

      return BadRequest(new ApiExceptionResponse(500));
    }


    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(PostModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PostModel>> DeletePost([FromRoute] string id)
    {
      PostModel? model = await post.DeletePostAsync(id);

      if (model is { })
      {
        return Ok(model);
      }

      return NotFound(new ApiExceptionResponse(404));
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PostModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PostModel>> GetPost([FromRoute] string id)
    {
      PostModel? model = await post.GetSinglePostAsync(id);

      if (model is not null)
      {
        return Ok(model);
      }

      return NotFound(new ApiExceptionResponse(404));
    }

    [HttpPatch]
    [ProducesResponseType(typeof(PostModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
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

      if (result is not null)
      {
        return Ok(postModel);
      }

      return NotFound(new ApiExceptionResponse(404));
    }

    [HttpGet("Toggle-Feature-Post/{id}")]
    [ProducesResponseType(typeof(PostModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PostModel>> ManagePostFeaturedAsync([FromRoute] string id)
    {
      PostModel? model = await post.ManagePostFeaturedAsync(id);

      if (model is not null)
      {
        return Ok(model);
      }

      return NotFound(new ApiExceptionResponse(404));
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("Featured-Posts")]
    [ProducesResponseType(typeof(PostModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PostModel>>> GetFeaturedPostsAsync()
    {
      IEnumerable<PostModel>? posts = await post.GetFeaturedPostsAsync();

      if (post is not null)
      {
        return Ok(posts);
      }

      return Ok(new ApiExceptionResponse(404));
    }

    [HttpGet("Categorise-Posts/{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PostModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiExceptionResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<PostModel>>> GetPostsByCategoryAsync([FromRoute] string id)
    {
      IEnumerable<PostModel>? posts = await post.GetPostsByCategoryIdAsync(id);

      if (post is not null)
      {
        return Ok(posts);
      }

      return NotFound(new ApiExceptionResponse(404));
    }


  }
}
