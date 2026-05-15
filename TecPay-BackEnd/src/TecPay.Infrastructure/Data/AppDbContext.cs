using Microsoft.EntityFrameworkCore;
using TecPay.Domain.Entities;

namespace TecPay.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Name).IsRequired().HasMaxLength(100);
            e.Property(c => c.Description).HasMaxLength(500);
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Name).IsRequired().HasMaxLength(200);
            e.Property(p => p.Description).HasMaxLength(1000);
            e.Property(p => p.Price).HasColumnType("decimal(18,2)");
            e.Property(p => p.Sku).IsRequired().HasMaxLength(50);
            e.HasIndex(p => p.Sku).IsUnique();
            e.HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId);
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Electrónica", Description = "Dispositivos y gadgets electrónicos", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = 2, Name = "Ropa", Description = "Prendas de vestir y accesorios", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = 3, Name = "Alimentos", Description = "Productos alimenticios", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = 4, Name = "Hogar", Description = "Artículos para el hogar", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Laptop HP Pavilion", Description = "Laptop 15.6\" 8GB RAM 256GB SSD", Price = 12999.99m, Stock = 25, Sku = "ELEC-001", CategoryId = 1, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Product { Id = 2, Name = "Mouse Inalámbrico", Description = "Mouse ergonómico Bluetooth", Price = 349.50m, Stock = 100, Sku = "ELEC-002", CategoryId = 1, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Product { Id = 3, Name = "Camiseta Polo", Description = "Camiseta polo algodón talla M", Price = 299.00m, Stock = 50, Sku = "ROPA-001", CategoryId = 2, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Product { Id = 4, Name = "Café Gourmet 1kg", Description = "Café de altura Oaxaca", Price = 189.00m, Stock = 200, Sku = "ALIM-001", CategoryId = 3, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Product { Id = 5, Name = "Lámpara LED", Description = "Lámpara de escritorio regulable", Price = 450.00m, Stock = 30, Sku = "HOGR-001", CategoryId = 4, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
