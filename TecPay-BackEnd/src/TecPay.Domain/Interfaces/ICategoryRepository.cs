using TecPay.Domain.Entities;

namespace TecPay.Domain.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(int id);
    Task<Category> CreateAsync(Category category);
    Task UpdateAsync(Category category);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
