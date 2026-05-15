using Microsoft.EntityFrameworkCore;
using TecPay.Domain.Entities;
using TecPay.Domain.Interfaces;
using TecPay.Infrastructure.Data;

namespace TecPay.Infrastructure.Repositories;

public class ProductRepository(AppDbContext context) : IProductRepository
{
    public async Task<(List<Product> Items, int TotalCount)> GetAllAsync(string? search, int? categoryId, int page, int pageSize, string? sortBy = null, string? sortDirection = null)
    {
        var query = context.Products.Include(p => p.Category).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()) || p.Sku.ToLower().Contains(search.ToLower()));

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        var totalCount = await query.CountAsync();

        var isDesc = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);
        query = (sortBy?.ToLowerInvariant()) switch
        {
            "name" => isDesc ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "sku" => isDesc ? query.OrderByDescending(p => p.Sku) : query.OrderBy(p => p.Sku),
            "price" => isDesc ? query.OrderByDescending(p => (double)p.Price) : query.OrderBy(p => (double)p.Price),
            "stock" => isDesc ? query.OrderByDescending(p => p.Stock) : query.OrderBy(p => p.Stock),
            "categoryname" => isDesc ? query.OrderByDescending(p => p.Category!.Name) : query.OrderBy(p => p.Category!.Name),
            "isactive" => isDesc ? query.OrderByDescending(p => p.IsActive) : query.OrderBy(p => p.IsActive),
            _ => isDesc ? query.OrderByDescending(p => p.Id) : query.OrderBy(p => p.Id),
        };

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Product?> GetByIdAsync(int id) =>
        await context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);

    public async Task<Product> CreateAsync(Product product)
    {
        context.Products.Add(product);
        await context.SaveChangesAsync();
        return product;
    }

    public async Task UpdateAsync(Product product)
    {
        context.Products.Update(product);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var product = await context.Products.FindAsync(id);
        if (product != null)
        {
            context.Products.Remove(product);
            await context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id) =>
        await context.Products.AnyAsync(p => p.Id == id);

    public async Task<bool> SkuExistsAsync(string sku, int? excludeId = null)
    {
        var query = context.Products.Where(p => p.Sku == sku);
        if (excludeId.HasValue)
            query = query.Where(p => p.Id != excludeId.Value);
        return await query.AnyAsync();
    }
}
