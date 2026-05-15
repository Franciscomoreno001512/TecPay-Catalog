using AutoMapper;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using TecPay.Application.DTOs;
using TecPay.Application.Features.Products.Commands.CreateProduct;
using TecPay.Application.Features.Products.Commands.DeleteProduct;
using TecPay.Application.Features.Products.Queries.GetProducts;
using TecPay.Application.Mapping;
using TecPay.Domain.Exceptions;
using TecPay.Infrastructure.Data;
using TecPay.Infrastructure.Repositories;

namespace TecPay.Tests;

public class ProductTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly ProductRepository _productRepo;
    private readonly CategoryRepository _categoryRepo;
    private readonly IMapper _mapper;

    public ProductTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _context.Database.EnsureCreated();

        _productRepo = new ProductRepository(_context);
        _categoryRepo = new CategoryRepository(_context);
        _mapper = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>()).CreateMapper();
    }

    [Fact]
    public async Task GetProducts_ReturnsPagedResult()
    {
        var handler = new GetProductsQueryHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetProductsQuery(null, null, 1, 10), CancellationToken.None);

        result.Items.Should().NotBeEmpty();
        result.TotalCount.Should().BeGreaterThan(0);
        result.Page.Should().Be(1);
    }

    [Fact]
    public async Task GetProducts_FilterBySearch_ReturnsFiltered()
    {
        var handler = new GetProductsQueryHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetProductsQuery("Laptop", null, 1, 10), CancellationToken.None);

        result.Items.Should().ContainSingle();
        result.Items[0].Name.Should().Contain("Laptop");
    }

    [Fact]
    public async Task GetProducts_FilterByCategory_ReturnsFiltered()
    {
        var handler = new GetProductsQueryHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetProductsQuery(null, 1, 1, 10), CancellationToken.None);

        result.Items.Should().AllSatisfy(p => p.CategoryId.Should().Be(1));
    }

    [Fact]
    public async Task CreateProduct_ValidData_ReturnsCreated()
    {
        var dto = new CreateProductDto("Test Product", "Test desc", 99.99m, 10, "TEST-999", 1);
        var handler = new CreateProductCommandHandler(_productRepo, _categoryRepo, _mapper);

        var result = await handler.Handle(new CreateProductCommand(dto), CancellationToken.None);

        result.Name.Should().Be("Test Product");
        result.Sku.Should().Be("TEST-999");
        result.CategoryId.Should().Be(1);
    }

    [Fact]
    public async Task CreateProduct_DuplicateSku_ThrowsBusinessRule()
    {
        var dto = new CreateProductDto("Dup", "Desc", 10m, 1, "ELEC-001", 1);
        var handler = new CreateProductCommandHandler(_productRepo, _categoryRepo, _mapper);

        var act = () => handler.Handle(new CreateProductCommand(dto), CancellationToken.None);
        await act.Should().ThrowAsync<BusinessRuleException>();
    }

    [Fact]
    public async Task CreateProduct_InvalidCategory_ThrowsNotFound()
    {
        var dto = new CreateProductDto("No Cat", "Desc", 10m, 1, "TEST-000", 999);
        var handler = new CreateProductCommandHandler(_productRepo, _categoryRepo, _mapper);

        var act = () => handler.Handle(new CreateProductCommand(dto), CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task DeleteProduct_Exists_RemovesSuccessfully()
    {
        var handler = new DeleteProductCommandHandler(_productRepo);
        await handler.Handle(new DeleteProductCommand(1), CancellationToken.None);

        var exists = await _productRepo.ExistsAsync(1);
        exists.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteProduct_NotExists_ThrowsNotFound()
    {
        var handler = new DeleteProductCommandHandler(_productRepo);
        var act = () => handler.Handle(new DeleteProductCommand(999), CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();
    }

    public void Dispose() => _context.Dispose();
}
