using AutoMapper;
using MediatR;
using TecPay.Application.DTOs;
using TecPay.Domain.Interfaces;

namespace TecPay.Application.Features.Categories.Queries.GetCategories;

public record GetCategoriesQuery : IRequest<List<CategoryDto>>;

public class GetCategoriesQueryHandler(ICategoryRepository repo, IMapper mapper) : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
{
    public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await repo.GetAllAsync();
        return mapper.Map<List<CategoryDto>>(categories);
    }
}
