using MediatR;
using TecPay.Domain.Exceptions;
using TecPay.Domain.Interfaces;

namespace TecPay.Application.Features.Products.Commands.DeleteProduct;

public record DeleteProductCommand(int Id) : IRequest<Unit>;

public class DeleteProductCommandHandler(IProductRepository repo) : IRequestHandler<DeleteProductCommand, Unit>
{
    public async Task<Unit> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        if (!await repo.ExistsAsync(request.Id))
            throw new NotFoundException("Product", request.Id);

        await repo.DeleteAsync(request.Id);
        return Unit.Value;
    }
}
