import { Theme } from './theme-symbols';
import { ThemeColors } from './theme-colors';

export const darkTheme: Theme = {
  name: 'dark',
  properties: "background: rgba(0,0,0,0.8)",
  color: ThemeColors.dark.brandprimarycolor ,
  classProperty: `
  html,body {
    color: ${ThemeColors.dark.brandprimarycolor};
    height: 100%;
  }
  .jqx-grid-column-header{
    background:  ${ThemeColors.dark.brandprimarycolor} ;
    color: white ;
    width: 20%;
    }
  
  span[id^="jqxWidget"] {
    color: transparent !important;
  }
  
  .jqx-widget .jqx-grid-cell{
    border-color: #aaa;
    border-right-color: darkgray !important;
  } 
  .primarybtnstyle{
    background: ${ThemeColors.dark.brandsecondarycolor};
    padding:5px 15px;
    color:white;
    border:0.5px solid transparent;
    font-size: 12px;
    border-radius: 5px !important;
    &:hover{
        color: white;
        border:0.5px solid ${ThemeColors.dark.brandsecondarycolor};
    }
    &:focus{
        outline:none;
        box-shadow: none;
    }
    
}
.secondarybtnstyle{
    background: ${ThemeColors.dark.brandprimarycolor};
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
  color: ${ThemeColors.dark.brandprimarycolor} !important;
}

.primary-color-1{
color: ${ThemeColors.dark.brandprimarycolorone} ;
}

.secondary-color{
  color: ${ThemeColors.dark.brandsecondarycolor};
}

.tertiary-color{
  color: ${ThemeColors.dark.brandtertiarycolor};
}

.quaternary-color{
  color: ${ThemeColors.dark.brandquaternarycolor};
}
.selectionIndicator{
  width: 3px;
  height: 100%;
  background-color: ${ThemeColors.dark.brandprimarycolor};
  position: absolute;
  left: 0;
}
.preIcon{
  padding-left: 15px;
  color: ${ThemeColors.dark.brandprimarycolor} !important ;
}

.active{
background-color: ${ThemeColors.dark.brandprimarycolorone};
}
.name{
  color: ${ThemeColors.dark.brandprimarycolor};
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
              border: 2px solid ${ThemeColors.dark.brandprimarycolor};;
              background-color: ${ThemeColors.dark.brandprimarycolor};;

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
          color: ${ThemeColors.dark.brandprimarycolor};
          background: rgba(206, 235, 232, 0.5);
        }
  }
    }
  }
} 




.danger-color{
  color:  ${ThemeColors.dark.branddangercolor};
}

.primary-bg-color{
    background-color: ${ThemeColors.dark.brandprimarycolor};
    color:  ${ThemeColors.dark.brandtertiarycolor};
}

.secondary-bg-color{
    background-color:  ${ThemeColors.dark.brandsecondarycolor};
    color:  ${ThemeColors.dark.brandtertiarycolor} ;
}

.primary-1-bg-color{
  background-color:  ${ThemeColors.dark.brandprimarycolorone};
}

.tertiary-bg-color{
    background-color:  ${ThemeColors.dark.brandtertiarycolor};
    color:  ${ThemeColors.dark.brandsecondarycolor} ;
}

.quaternary-bg-color{
    color:  ${ThemeColors.dark.brandsecondarycolor};
    background-color:  ${ThemeColors.dark.brandquaternarycolor};
}`
 
};