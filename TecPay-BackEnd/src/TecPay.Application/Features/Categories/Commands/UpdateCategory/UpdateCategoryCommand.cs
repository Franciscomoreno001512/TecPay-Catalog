using AutoMapper;
using FluentValidation;
using MediatR;
using TecPay.Application.DTOs;
using TecPay.Domain.Exceptions;
using TecPay.Domain.Interfaces;

namespace TecPay.Application.Features.Categories.Commands.UpdateCategory;

public record UpdateCategoryCommand(int Id, UpdateCategoryDto Dto) : IRequest<CategoryDto>;

public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Dto.Name).NotEmpty().MaximumLength(100);
    }
}

public class UpdateCategoryCommandHandler(ICategoryRepository repo, IMapper mapper) : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await repo.GetByIdAsync(request.Id)
            ?? throw new NotFoundException("Category", request.Id);

        mapper.Map(request.Dto, category);
        category.UpdatedAt = DateTime.UtcNow;
        await repo.UpdateAsync(category);
        return mapper.Map<CategoryDto>(category);
    }
}
