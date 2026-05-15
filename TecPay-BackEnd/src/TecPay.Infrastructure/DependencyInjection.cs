using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TecPay.Domain.Interfaces;
using TecPay.Infrastructure.Data;
using TecPay.Infrastructure.Repositories;

namespace TecPay.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        return services;
    }
}
