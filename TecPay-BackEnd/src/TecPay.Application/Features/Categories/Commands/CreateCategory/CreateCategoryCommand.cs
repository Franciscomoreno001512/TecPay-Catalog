using AutoMapper;
using FluentValidation;
using MediatR;
using TecPay.Application.DTOs;
using TecPay.Domain.Entities;
using TecPay.Domain.Interfaces;

namespace TecPay.Application.Features.Categories.Commands.CreateCategory;

public record CreateCategoryCommand(CreateCategoryDto Dto) : IRequest<CategoryDto>;

public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(x => x.Dto.Name).NotEmpty().MaximumLength(100);
    }
}

public class CreateCategoryCommandHandler(ICategoryRepository repo, IMapper mapper) : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = mapper.Map<Category>(request.Dto);
        var created = await repo.CreateAsync(category);
        return mapper.Map<CategoryDto>(created);
    }
}
