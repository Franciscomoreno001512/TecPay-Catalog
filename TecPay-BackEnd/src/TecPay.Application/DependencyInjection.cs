using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using TecPay.Application.Common.Behaviors;
using TecPay.Application.Mapping;

namespace TecPay.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(DependencyInjection).Assembly;
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddValidatorsFromAssembly(assembly);
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        return services;
    }
}
