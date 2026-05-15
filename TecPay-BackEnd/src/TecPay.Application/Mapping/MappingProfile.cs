using AutoMapper;
using TecPay.Application.DTOs;
using TecPay.Domain.Entities;

namespace TecPay.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>()
            .ForCtorParam("CategoryName", opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : ""));

        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
        CreateMap<Category, CategoryDto>();
        CreateMap<CreateCategoryDto, Category>();
        CreateMap<UpdateCategoryDto, Category>();
    }
}
