import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePaginatedSearchPipe implements PipeTransform {
  readonly _possibleParams = ['search', 'limit', 'offset'];

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata?.type != 'query') return {};

    Object.keys(value).forEach((key) => {
      if (!this._possibleParams.includes(key)) {
        delete value[key];
        return;
      }

      switch (key) {
        case 'limit':
          value.take = value.limit;
          delete value['limit'];
          break;
        case 'offset':
          value.skip = value.offset;
          delete value['offset'];
          break;
      }
    });

    return value;
  }
}
