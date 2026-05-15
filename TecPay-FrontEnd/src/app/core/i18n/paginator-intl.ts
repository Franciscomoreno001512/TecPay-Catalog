import { MatPaginatorIntl } from '@angular/material/paginator';

export function getSpanishPaginatorIntl(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = 'Elementos por pagina:';
  intl.nextPageLabel = 'Siguiente';
  intl.previousPageLabel = 'Anterior';
  intl.firstPageLabel = 'Primera pagina';
  intl.lastPageLabel = 'Ultima pagina';
  intl.getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) return `0 de ${length}`;
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} de ${length}`;
  };
  return intl;
}
