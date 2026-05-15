namespace TecPay.Application.DTOs;

public record ProductDto(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    int Stock,
    string Sku,
    bool IsActive,
    int CategoryId,
    string CategoryName,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public record CreateProductDto(
    string Name,
    string? Description,
    decimal Price,
    int Stock,
    string Sku,
    int CategoryId);

public record UpdateProductDto(
    string Name,
    string? Description,
    decimal Price,
    int Stock,
    string Sku,
    bool IsActive,
    int CategoryId);
