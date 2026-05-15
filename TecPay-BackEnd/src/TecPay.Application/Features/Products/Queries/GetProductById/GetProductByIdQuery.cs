using AutoMapper;
using MediatR;
using TecPay.Application.DTOs;
using TecPay.Domain.Exceptions;
using TecPay.Domain.Interfaces;

namespace TecPay.Application.Features.Products.Queries.GetProductById;

public record GetProductByIdQuery(int Id) : IRequest<ProductDto>;

public class GetProductByIdQueryHandler(IProductRepository repo, IMapper mapper) : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await repo.GetByIdAsync(request.Id)
            ?? throw new NotFoundException("Product", request.Id);
        return mapper.Map<ProductDto>(product);
    }
}
