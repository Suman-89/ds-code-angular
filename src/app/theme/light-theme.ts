import { Theme } from './theme-symbols';
import {ThemeColors} from './theme-colors' ;

export const lightTheme: Theme = {
  name: 'light',
  properties: "background: #f8f9fa",
  color: ThemeColors.light.brandprimarycolor,
  classProperty: `
  html,body {
    color: ${ThemeColors.light.brandprimarycolor};
    height: 100%;
  }
  
  .jqx-grid-column-header{
    background:  ${ThemeColors.light.brandprimarycolor} ;
    color: white ;
    width: 20%;
    }
  
  span[id^="jqxWidget"] {
    color: transparent !important;
  }
  
  .jqx-widget .jqx-grid-cell{
    border-color: #aaa;
    border-right-color: lightgray !important;
  } 
  .primarybtnstyle{
    background: ${ThemeColors.light.brandsecondarycolor};
    padding:5px 15px;
    color:white;
    border:0.5px solid transparent;
    font-size: 12px;
    border-radius: 5px !important;
    &:hover{
        color: white;
        border:0.5px solid ${ThemeColors.light.brandsecondarycolor};
    }
    &:focus{
        outline:none;
        box-shadow: none;
    }
    
}
.secondarybtnstyle{
    background: ${ThemeColors.light.brandprimarycolor};
    padding: 5px 15px;
    color: white;
    border: 1px solid transparent;
    font-size: 12px;
    border-radius: 5px !important;
    &:hover{
        color: white;
        border:1px solid #ceebe8;
    }
    &:focus{
        outline:none;
        box-shadow: none;
    }
   
}
.primary-color{
  color: ${ThemeColors.light.brandprimarycolor} !important;
}

.primary-color-1{
color: ${ThemeColors.light.brandprimarycolorone} ;
}

.secondary-color{
  color: ${ThemeColors.light.brandsecondarycolor};
}

.tertiary-color{
  color: ${ThemeColors.light.brandtertiarycolor};
}

.quaternary-color{
  color: ${ThemeColors.light.brandquaternarycolor};
}
.selectionIndicator{

  background-color: ${ThemeColors.light.brandprimarycolor};
 
}
.preIcon{
  color: ${ThemeColors.light.brandprimarycolor} !important ;
}

.active{
background-color: ${ThemeColors.light.brandprimarycolorone};
}
.name{
  color: ${ThemeColors.light.brandprimarycolor};
}

.navbar-nav{
  .nav-item{
    .nav-link{
      &.noti-icon-container{
        .noti-icon{
          color:$brand-primary-color;
        }
      }

      &.nav-user{
        img{
          height: 35px;
        }
        .avtarContainer{
          .avtarmain{
            .avtartext{
              border: 2px solid ${ThemeColors.light.brandprimarycolor};;
              background-color: ${ThemeColors.light.brandprimarycolor};;

            }
          }
        }
      }
    }
    .notification-item-list {
      .notify-item {
        &:hover{
          background: rgba(206, 235, 232, 0.38);
        }
        &.active{
          color: ${ThemeColors.light.brandprimarycolor};
          background: rgba(206, 235, 232, 0.5);
        }

        
        
      }
    }
  }
}




.danger-color{
  color:  ${ThemeColors.light.branddangercolor};
}

.primary-bg-color{
    background-color: ${ThemeColors.light.brandprimarycolor};
    color:  ${ThemeColors.light.brandtertiarycolor};
}

.secondary-bg-color{
    background-color:  ${ThemeColors.light.brandsecondarycolor};
    color:  ${ThemeColors.light.brandtertiarycolor} ;
}

.primary-1-bg-color{
  background-color:  ${ThemeColors.light.brandprimarycolorone};
}

.tertiary-bg-color{
    background-color:  ${ThemeColors.light.brandtertiarycolor};
    color:  ${ThemeColors.light.brandsecondarycolor} ;
}

.quaternary-bg-color{
    color:  ${ThemeColors.light.brandsecondarycolor};
    background-color:  ${ThemeColors.light.brandquaternarycolor};
}
`
};
