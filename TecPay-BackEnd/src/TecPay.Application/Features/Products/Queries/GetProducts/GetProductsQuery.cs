using AutoMapper;
using MediatR;
using TecPay.Application.DTOs;
using TecPay.Domain.Interfaces;

namespace TecPay.Application.Features.Products.Queries.GetProducts;

public record GetProductsQuery(string? Search, int? CategoryId, int Page = 1, int PageSize = 10, string? SortBy = null, string? SortDirection = null) : IRequest<PagedResult<ProductDto>>;

public class GetProductsQueryHandler(IProductRepository repo, IMapper mapper) : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var (items, totalCount) = await repo.GetAllAsync(request.Search, request.CategoryId, request.Page, request.PageSize, request.SortBy, request.SortDirection);
        var dtos = mapper.Map<List<ProductDto>>(items);
        return new PagedResult<ProductDto>(dtos, totalCount, request.Page, request.PageSize);
    }
}
