using AutoMapper;
using FluentValidation;
using MediatR;
using TecPay.Application.DTOs;
using TecPay.Domain.Entities;
using TecPay.Domain.Exceptions;
using TecPay.Domain.Interfaces;

namespace TecPay.Application.Features.Products.Commands.CreateProduct;

public record CreateProductCommand(CreateProductDto Dto) : IRequest<ProductDto>;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Dto.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Dto.Price).GreaterThan(0);
        RuleFor(x => x.Dto.Stock).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Dto.Sku).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Dto.CategoryId).GreaterThan(0);
    }
}

public class CreateProductCommandHandler(
    IProductRepository productRepo,
    ICategoryRepository categoryRepo,
    IMapper mapper) : IRequestHandler<CreateProductCommand, ProductDto>
{
    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        if (!await categoryRepo.ExistsAsync(request.Dto.CategoryId))
            throw new NotFoundException("Category", request.Dto.CategoryId);

        if (await productRepo.SkuExistsAsync(request.Dto.Sku))
            throw new BusinessRuleException($"A product with SKU '{request.Dto.Sku}' already exists.");

        var product = mapper.Map<Product>(request.Dto);
        var created = await productRepo.CreateAsync(product);
        var full = await productRepo.GetByIdAsync(created.Id);
        return mapper.Map<ProductDto>(full);
    }
}
