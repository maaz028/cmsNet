using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
  public class AppDBContext : DbContext
  {
    public AppDBContext(DbContextOptions<AppDBContext> options):base(options)
    {

    }
    public DbSet<CategoryModel>? Category { get; set; }
    public DbSet<PostModel>? Post { get; set; }
    public DbSet<PostImageModel>? PostImage { get; set; }
    public DbSet<AccountModel>? Account { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
      modelBuilder.Entity<CategoryModel>()
        .Property(x => x.ID).ValueGeneratedOnAdd();
      modelBuilder.Entity<PostModel>()
          .Property(x => x.ID).ValueGeneratedOnAdd();
      modelBuilder.Entity<PostImageModel>()
        .Property(x => x.ID).ValueGeneratedOnAdd();
      modelBuilder.Entity<AccountModel>()
        .Property(x => x.ID).ValueGeneratedOnAdd();

    }
  }
}
