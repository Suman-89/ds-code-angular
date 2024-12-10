import { Pipe, PipeTransform } from '@angular/core';
import { Roles } from 'src/app/core/_models';

@Pipe({ name: 'displayRoles' })
export class DisplayRolesPipe implements PipeTransform {

  transform(roles: string[]): string[] {
    if(roles.length > 1){
        roles = roles.filter( role => role != Roles.GUEST_USER);
    }
    return roles.sort();
  }
}