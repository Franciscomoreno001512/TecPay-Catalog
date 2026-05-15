namespace TecPay.Domain.Exceptions;

public class NotFoundException(string entity, object key)
    : Exception($"Entity '{entity}' with key '{key}' was not found.");
