using Microsoft.EntityFrameworkCore;
using TecPay.Domain.Entities;
using TecPay.Domain.Interfaces;
using TecPay.Infrastructure.Data;

namespace TecPay.Infrastructure.Repositories;

public class CategoryRepository(AppDbContext context) : ICategoryRepository
{
    public async Task<List<Category>> GetAllAsync() =>
        await context.Categories.OrderBy(c => c.Name).ToListAsync();

    public async Task<Category?> GetByIdAsync(int id) =>
        await context.Categories.FindAsync(id);

    public async Task<Category> CreateAsync(Category category)
    {
        context.Categories.Add(category);
        await context.SaveChangesAsync();
        return category;
    }

    public async Task UpdateAsync(Category category)
    {
        context.Categories.Update(category);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var category = await context.Categories.FindAsync(id);
        if (category != null)
        {
            context.Categories.Remove(category);
            await context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id) =>
        await context.Categories.AnyAsync(c => c.Id == id);
}
