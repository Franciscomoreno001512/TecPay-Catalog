namespace TecPay.Application.DTOs;

public record CategoryDto(int Id, string Name, string? Description, bool IsActive, DateTime CreatedAt);

public record CreateCategoryDto(string Name, string? Description);

public record UpdateCategoryDto(string Name, string? Description, bool IsActive);
