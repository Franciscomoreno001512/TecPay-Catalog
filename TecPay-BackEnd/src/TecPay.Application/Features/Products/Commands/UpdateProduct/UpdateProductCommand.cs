using AutoMapper;
using FluentValidation;
using MediatR;
using TecPay.Application.DTOs;
using TecPay.Domain.Exceptions;
using TecPay.Domain.Interfaces;

namespace TecPay.Application.Features.Products.Commands.UpdateProduct;

public record UpdateProductCommand(int Id, UpdateProductDto Dto) : IRequest<ProductDto>;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Dto.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Dto.Price).GreaterThan(0);
        RuleFor(x => x.Dto.Stock).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Dto.Sku).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Dto.CategoryId).GreaterThan(0);
    }
}

public class UpdateProductCommandHandler(
    IProductRepository productRepo,
    ICategoryRepository categoryRepo,
    IMapper mapper) : IRequestHandler<UpdateProductCommand, ProductDto>
{
    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await productRepo.GetByIdAsync(request.Id)
            ?? throw new NotFoundException("Product", request.Id);

        if (!await categoryRepo.ExistsAsync(request.Dto.CategoryId))
            throw new NotFoundException("Category", request.Dto.CategoryId);

        if (await productRepo.SkuExistsAsync(request.Dto.Sku, request.Id))
            throw new BusinessRuleException($"A product with SKU '{request.Dto.Sku}' already exists.");

        mapper.Map(request.Dto, product);
        product.UpdatedAt = DateTime.UtcNow;
        await productRepo.UpdateAsync(product);

        var updated = await productRepo.GetByIdAsync(request.Id);
        return mapper.Map<ProductDto>(updated);
    }
}
