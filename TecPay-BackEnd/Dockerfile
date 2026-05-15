FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 10000

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY src/TecPay.Domain/TecPay.Domain.csproj src/TecPay.Domain/
COPY src/TecPay.Application/TecPay.Application.csproj src/TecPay.Application/
COPY src/TecPay.Infrastructure/TecPay.Infrastructure.csproj src/TecPay.Infrastructure/
COPY src/TecPay.Api/TecPay.Api.csproj src/TecPay.Api/
RUN dotnet restore src/TecPay.Api/TecPay.Api.csproj
COPY . .
RUN dotnet publish src/TecPay.Api/TecPay.Api.csproj -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:10000
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "TecPay.Api.dll"]
