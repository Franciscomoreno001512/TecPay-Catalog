using MediatR;
using TecPay.Domain.Exceptions;
using TecPay.Domain.Interfaces;

namespace TecPay.Application.Features.Categories.Commands.DeleteCategory;

public record DeleteCategoryCommand(int Id) : IRequest<Unit>;

public class DeleteCategoryCommandHandler(ICategoryRepository repo) : IRequestHandler<DeleteCategoryCommand, Unit>
{
    public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        if (!await repo.ExistsAsync(request.Id))
            throw new NotFoundException("Category", request.Id);

        await repo.DeleteAsync(request.Id);
        return Unit.Value;
    }
}
