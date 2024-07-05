import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitText'
})

export class LimitTextPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.slice(0,20) + "....";
  }

}
