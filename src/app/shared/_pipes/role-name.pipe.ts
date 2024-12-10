import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleName'
})
export class RoleNamePipe implements PipeTransform {

  transform(value: string): string {
    if(value){
      //let newValue = value.replace(CoreConstants.ROLE_PREFIX,'').replace('_',' ');
      let newValue = value.replace('_',' ');
      return newValue
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase())
      .join(' ');
    } else{
      return '';
    }
  }

}
