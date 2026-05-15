# TecPay Catalog - Prueba Tecnica Fullstack

Sistema CRUD de catalogo de productos construido con **.NET 9** (Clean Architecture + CQRS) y **Angular 19** (Standalone Components + Signals + Angular Material).

---

## Requerimientos Previos

- .NET SDK 9.0+
- Node.js 18+ y npm
- Angular CLI (`npm install -g @angular/cli`)

## Como ejecutar

### Backend (.NET 9 API)

```bash
cd TecPay-BackEnd/src/TecPay.Api
dotnet run --urls "http://localhost:5200"
```

API: `http://localhost:5200` | Swagger: `http://localhost:5200/swagger`

### Frontend (Angular 19)

```bash
cd TecPay-FrontEnd
npm install
ng serve
```

Aplicacion: `http://localhost:4200`

### Ejecutar Tests

```bash
cd TecPay-BackEnd
dotnet test tests/TecPay.Tests/TecPay.Tests.csproj
```

## Credenciales de acceso

| Usuario | Contrasena   |
|---------|-------------|
| admin   | TecPay2025! |

---

## Funcionalidades Implementadas

### Requeridos (cumplidos)

| Requerimiento | Estado | Detalle |
|---------------|--------|---------|
| CRUD completo de catalogo | Cumplido | Productos y Categorias con Create, Read, Update, Delete |
| EF Core con SQLite | Cumplido | Base de datos embebida, se crea automaticamente con datos semilla |
| Respuestas HTTP correctas | Cumplido | 200 OK, 201 Created, 204 NoContent, 400 BadRequest, 404 NotFound, 500 InternalServerError |
| Excepciones globales | Cumplido | Middleware centralizado que mapea excepciones a codigos HTTP |
| Principios SOLID | Cumplido | Ver seccion de arquitectura |
| Patrones de diseno | Cumplido | Repository, CQRS, Mediator, Pipeline Behavior |
| SPA Angular con CRUD | Cumplido | Consume la API con HttpClient, operaciones completas |
| Formularios reactivos | Cumplido | Reactive Forms con validaciones (required, min, maxLength) |
| Guards / Interceptors | Cumplido | authGuard protege rutas, authInterceptor inyecta JWT, errorInterceptor maneja 401 |
| Manejo de estado | Cumplido | Angular Signals en servicios (products, totalCount, loading, currentPage, pageSize) |

### Deseables (cumplidos)

| Deseable | Estado | Detalle |
|----------|--------|---------|
| Filtros y paginacion | Cumplido | Busqueda por nombre/SKU (case-insensitive), filtro por categoria, paginacion server-side |
| Ordenamiento | Cumplido | Sorting server-side por ID, nombre, SKU, precio, stock, categoria |
| Vista de detalle | Cumplido | Pantalla dedicada con toda la informacion del producto |
| Seguridad JWT | Cumplido | JWT Bearer con policy "AdminOnly", token de 2 horas |
| CORS | Cumplido | Configurado para permitir Angular en localhost:4200 |
| Unit tests backend | Cumplido | 8 tests con xUnit + FluentAssertions + Moq |
| Lazy Loading | Cumplido | Todas las rutas cargan componentes con loadComponent + import dinamico |
| Mejoras UI/UX | Cumplido | Diseno custom con Angular Material, animaciones CSS, responsive |
| Coleccion Postman | Cumplido | TecPay_Catalog.postman_collection.json con todas las operaciones |
| Pagina 404 | Cumplido | Ruta wildcard con pagina estilizada "No encontrada" |

---

## Arquitectura y Patrones

### Clean Architecture (4 capas)

```
TecPay-BackEnd/
  src/
    TecPay.Domain/           -> Entidades, Interfaces, Excepciones de dominio
    TecPay.Application/      -> CQRS (Commands/Queries), DTOs, Validators, Mapping
    TecPay.Infrastructure/   -> EF Core DbContext, Repositorios, SQLite
    TecPay.Api/              -> Controllers, Middleware, Configuracion JWT/CORS
  tests/
    TecPay.Tests/            -> Tests unitarios con xUnit
```

**Flujo de dependencias:** Api -> Application -> Domain <- Infrastructure

El dominio no depende de ninguna capa externa. La infraestructura implementa interfaces definidas en el dominio (Dependency Inversion).

### CQRS con MediatR

Se separan las operaciones de lectura (Queries) y escritura (Commands) mediante MediatR:

| Operacion | Tipo | Handler |
|-----------|------|---------|
| Listar productos | `GetProductsQuery` | Soporta search, categoryId, page, pageSize, sortBy, sortDirection |
| Obtener producto | `GetProductByIdQuery` | Busca por ID, lanza NotFoundException si no existe |
| Crear producto | `CreateProductCommand` | Valida SKU unico y categoria existente |
| Actualizar producto | `UpdateProductCommand` | Valida existencia, SKU unico (excluyendo el actual) |
| Eliminar producto | `DeleteProductCommand` | Valida existencia antes de eliminar |

### Principios SOLID aplicados

| Principio | Implementacion |
|-----------|---------------|
| **S - Single Responsibility** | Cada handler tiene una sola responsabilidad. Los validators, repositories, controllers y middleware tienen funciones claramente separadas |
| **O - Open/Closed** | El pipeline de MediatR permite agregar behaviors (validacion, logging) sin modificar handlers existentes |
| **L - Liskov Substitution** | Los repositorios implementan interfaces del dominio, sustituibles en tests con mocks |
| **I - Interface Segregation** | `IProductRepository` e `ICategoryRepository` son interfaces especificas por entidad, no una interfaz generica |
| **D - Dependency Inversion** | Las capas altas dependen de abstracciones (interfaces), no de implementaciones concretas. El dominio define `IProductRepository`, la infraestructura lo implementa |

### Patrones de diseno utilizados

| Patron | Donde se usa | Por que |
|--------|-------------|---------|
| **Repository** | `ProductRepository`, `CategoryRepository` | Abstrae el acceso a datos, permite testear sin DB real |
| **Mediator** | MediatR en toda la capa Application | Desacopla controllers de logica de negocio |
| **CQRS** | Commands vs Queries separados | Optimiza lecturas y escrituras de forma independiente |
| **Pipeline Behavior** | `ValidationBehavior<TRequest, TResponse>` | Ejecuta validaciones automaticamente antes de cada handler |
| **DTO / Mapping** | `ProductDto`, `CreateProductDto`, AutoMapper Profile | Evita exponer entidades de dominio, controla la forma de los datos |
| **Domain Exception** | `NotFoundException`, `BusinessRuleException` | Excepciones semanticas del dominio, mapeadas a HTTP por el middleware |
| **Interceptor** | `authInterceptor`, `errorInterceptor` en Angular | Inyecta JWT y maneja errores HTTP de forma transversal |
| **Guard** | `authGuard` en Angular | Protege rutas sin duplicar logica de autenticacion |

---

## Decisiones Tecnicas Clave

### 1. SQLite como base de datos
Se eligio SQLite por ser embebida y no requerir instalacion. La base se crea automaticamente al iniciar la API con datos semilla (categorias y productos iniciales). Esto facilita la evaluacion sin configurar un servidor de BD.

### 2. CQRS con MediatR
Se implemento CQRS para separar claramente las operaciones de lectura y escritura. Cada Command/Query tiene su propio handler, lo que facilita el testing unitario y la mantenibilidad. El pipeline de MediatR permite agregar cross-cutting concerns (validacion) sin modificar la logica de negocio.

### 3. FluentValidation como Pipeline Behavior
En lugar de validar manualmente en cada handler, se creo un `ValidationBehavior` que intercepta cada request de MediatR y ejecuta todos los validators registrados. Si hay errores, lanza `ValidationException` antes de que el handler se ejecute.

### 4. Middleware de excepciones globales
Se centralizo el manejo de errores en `ExceptionHandlingMiddleware`. Las excepciones de dominio (`NotFoundException`, `BusinessRuleException`) se mapean automaticamente a codigos HTTP (404, 400). Cualquier excepcion no controlada retorna 500 con un mensaje generico, evitando exponer detalles internos.

### 5. Angular Signals para estado
Se eligio Signals (Angular 19) sobre BehaviorSubjects por ser el mecanismo reactivo moderno recomendado por Angular. Los servicios exponen signals de solo lectura (`products()`, `loading()`, `totalCount()`), lo que simplifica el binding en templates y evita subscripciones manuales.

### 6. Sorting y paginacion server-side
El ordenamiento y paginacion se ejecutan en el servidor (no en el cliente) para funcionar correctamente con datasets grandes. El frontend envia `sortBy`, `sortDirection`, `page` y `pageSize` como query params. El backend aplica el ORDER BY dinamico en EF Core.

### 7. Busqueda case-insensitive
La busqueda por nombre y SKU convierte ambos lados a minusculas (`ToLower()`) para que el usuario pueda buscar "laptop", "LAPTOP" o "Laptop" y obtener los mismos resultados.

### 8. JWT con doble capa de seguridad
Los endpoints GET son publicos (permiten consultar sin autenticacion). Los endpoints de escritura (POST/PUT/DELETE) requieren JWT valido. Ademas, se definio una policy "AdminOnly" para escenarios de autorizacion por rol.

### 9. Standalone Components + Lazy Loading
Se utilizo la arquitectura moderna de Angular sin NgModules. Cada componente es standalone con sus propios imports. Las rutas cargan componentes con `loadComponent` e import dinamico, reduciendo el bundle inicial.

### 10. Diseno UI custom sobre Angular Material
Se eligio Angular Material como base por su accesibilidad y componentes probados (MatTable, MatSort, MatPaginator, MatSelect, MatDialog). Sobre esa base se aplico un diseno visual custom (gradientes, sombras, animaciones CSS) para lograr una interfaz moderna y profesional sin depender del theme default de Material.

---

## Tests

### Backend - 8 tests unitarios (xUnit + FluentAssertions + Moq)

| Test | Que verifica |
|------|-------------|
| `GetProducts_ReturnsPagedResult` | Que la consulta de productos retorna resultados paginados correctamente |
| `GetProducts_FilterBySearch_ReturnsFiltered` | Que el filtro de busqueda por nombre/SKU funciona |
| `GetProducts_FilterByCategory_ReturnsFiltered` | Que el filtro por categoria retorna solo productos de esa categoria |
| `CreateProduct_ValidData_ReturnsCreated` | Que crear un producto con datos validos retorna el producto creado |
| `CreateProduct_DuplicateSku_ThrowsBusinessRule` | Que no se permite crear un producto con SKU duplicado (regla de negocio) |
| `CreateProduct_InvalidCategory_ThrowsNotFound` | Que crear un producto con categoria inexistente lanza NotFoundException |
| `DeleteProduct_Exists_RemovesSuccessfully` | Que eliminar un producto existente lo remueve correctamente |
| `DeleteProduct_NotExists_ThrowsNotFound` | Que eliminar un producto inexistente lanza NotFoundException |

Los tests usan SQLite in-memory para simular la base de datos real, verificando el flujo completo desde el handler hasta el repositorio.

---

## Tecnologia Utilizada

### Backend
| Tecnologia | Version | Proposito |
|-----------|---------|-----------|
| .NET | 9.0 | Framework principal |
| C# | 13 | Lenguaje |
| EF Core | 9.0 | ORM con SQLite |
| MediatR | 12 | Mediator para CQRS |
| AutoMapper | 13 | Mapeo entidad -> DTO |
| FluentValidation | 11 | Validaciones declarativas |
| JWT Bearer | - | Autenticacion |
| Swashbuckle | - | Swagger/OpenAPI |
| xUnit | 2.9 | Framework de tests |
| FluentAssertions | 7.2 | Assertions legibles |
| Moq | 4.20 | Mocking |

### Frontend
| Tecnologia | Version | Proposito |
|-----------|---------|-----------|
| Angular | 19 | Framework SPA |
| Angular Material | 19 | Componentes UI (MatTable, MatSort, MatPaginator, MatSelect, MatDialog, MatSnackBar, MatIcon) |
| TypeScript | 5.x | Lenguaje |
| RxJS | 7.x | Operadores reactivos (tap, catchError, pipe) en servicios HTTP |
| Signals | Angular 19 | Manejo de estado reactivo |

---

## Estructura del Proyecto

```
examen tecnico/
  TecPay-BackEnd/                            <- .NET 9 API (Clean Architecture + CQRS)
    TecPay.sln
    src/
      TecPay.Api/
        Controllers/                         <- ProductsController, CategoriesController, AuthController
        Middleware/                           <- ExceptionHandlingMiddleware (400/404/500)
        Program.cs                           <- JWT, CORS, DI, Pipeline
      TecPay.Application/
        Common/Behaviors/                    <- ValidationBehavior (FluentValidation pipeline)
        DTOs/                                <- ProductDto, CreateProductDto, UpdateProductDto, etc.
        Features/
          Products/
            Commands/                        <- CreateProduct, UpdateProduct, DeleteProduct (+ Validators)
            Queries/                         <- GetProducts, GetProductById
          Categories/
            Commands/                        <- CreateCategory, UpdateCategory, DeleteCategory
            Queries/                         <- GetCategories
        Mapping/                             <- AutoMapper Profile
      TecPay.Domain/
        Entities/                            <- Product, Category
        Interfaces/                          <- IProductRepository, ICategoryRepository
        Exceptions/                          <- NotFoundException, BusinessRuleException
      TecPay.Infrastructure/
        Data/                                <- AppDbContext, Configurations, DataSeeder
        Repositories/                        <- ProductRepository, CategoryRepository
    tests/
      TecPay.Tests/                          <- 8 unit tests (xUnit + FluentAssertions + Moq)
  TecPay-FrontEnd/                           <- Angular 19 SPA (Standalone + Material)
    src/app/
      core/
        guards/                              <- authGuard (protege rutas autenticadas)
        interceptors/                        <- authInterceptor (JWT), errorInterceptor (401)
        models/                              <- product.model.ts, category.model.ts
        services/                            <- ProductService (Signals), CategoryService, AuthService
        i18n/                                <- paginator-intl.ts (paginador en espanol)
      features/
        auth/components/login/               <- LoginComponent (standalone, lazy-loaded)
        products/components/
          product-list/                      <- Tabla con filtros, sorting, paginacion
          product-form/                      <- Formulario reactivo (crear/editar)
          product-detail/                    <- Vista de detalle del producto
      shared/components/
        layout/                              <- Navbar con navegacion y logout
        confirm-dialog/                      <- Dialogo de confirmacion personalizado
        not-found/                           <- Pagina 404
  README.md                                  <- Documentacion del proyecto
  TecPay_Catalog.postman_collection.json     <- Coleccion de Postman (CRUD completo)
  Prueba Tecnica TEC-PAY.pdf                 <- Enunciado de la prueba
```

## Coleccion de Postman

Importar `TecPay_Catalog.postman_collection.json` en Postman. Ejecutar primero **Login** para obtener el token JWT automaticamente en las variables de coleccion. Los endpoints de escritura (POST/PUT/DELETE) usan el token de la variable `{{token}}`.
