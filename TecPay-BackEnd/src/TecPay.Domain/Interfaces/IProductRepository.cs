using TecPay.Domain.Entities;

namespace TecPay.Domain.Interfaces;

public interface IProductRepository
{
    Task<(List<Product> Items, int TotalCount)> GetAllAsync(string? search, int? categoryId, int page, int pageSize, string? sortBy = null, string? sortDirection = null);
    Task<Product?> GetByIdAsync(int id);
    Task<Product> CreateAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> SkuExistsAsync(string sku, int? excludeId = null);
}
