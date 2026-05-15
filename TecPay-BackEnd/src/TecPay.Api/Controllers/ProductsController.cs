using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecPay.Application.DTOs;
using TecPay.Application.Features.Products.Commands.CreateProduct;
using TecPay.Application.Features.Products.Commands.DeleteProduct;
using TecPay.Application.Features.Products.Commands.UpdateProduct;
using TecPay.Application.Features.Products.Queries.GetProductById;
using TecPay.Application.Features.Products.Queries.GetProducts;

namespace TecPay.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ProductDto>>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] int? categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? sortBy = null, [FromQuery] string? sortDirection = null)
    {
        var result = await mediator.Send(new GetProductsQuery(search, categoryId, page, pageSize, sortBy, sortDirection));
        return Ok(ApiResponse<PagedResult<ProductDto>>.Ok(result));
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await mediator.Send(new GetProductByIdQuery(id));
        return Ok(ApiResponse<ProductDto>.Ok(result));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var result = await mediator.Send(new CreateProductCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<ProductDto>.Ok(result, "Product created."));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        var result = await mediator.Send(new UpdateProductCommand(id, dto));
        return Ok(ApiResponse<ProductDto>.Ok(result, "Product updated."));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> Delete(int id)
    {
        await mediator.Send(new DeleteProductCommand(id));
        return NoContent();
    }
}
