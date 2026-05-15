using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecPay.Application.DTOs;
using TecPay.Application.Features.Categories.Commands.CreateCategory;
using TecPay.Application.Features.Categories.Commands.DeleteCategory;
using TecPay.Application.Features.Categories.Commands.UpdateCategory;
using TecPay.Application.Features.Categories.Queries.GetCategories;

namespace TecPay.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<List<CategoryDto>>), 200)]
    public async Task<IActionResult> GetAll()
    {
        var result = await mediator.Send(new GetCategoriesQuery());
        return Ok(ApiResponse<List<CategoryDto>>.Ok(result));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<CategoryDto>), 201)]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var result = await mediator.Send(new CreateCategoryCommand(dto));
        return CreatedAtAction(nameof(GetAll), ApiResponse<CategoryDto>.Ok(result, "Category created."));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<CategoryDto>), 200)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        var result = await mediator.Send(new UpdateCategoryCommand(id, dto));
        return Ok(ApiResponse<CategoryDto>.Ok(result, "Category updated."));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> Delete(int id)
    {
        await mediator.Send(new DeleteCategoryCommand(id));
        return NoContent();
    }
}
