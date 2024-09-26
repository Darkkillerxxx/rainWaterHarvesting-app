export const menuContents = [
    {
        label:"Dashboard",
        value:"Dashboard",
        screenName:'Dashboard',
        icon:'bar-chart-outline',
        visibleToGuest:true,
        visbleTo:[1,2,3]
    },
    {
        label:"View Records",
        value:"DataTable",
        screenName:'DataTable',
        icon:'file-tray-full-outline',
        visibleToGuest:true,
        visbleTo:[1,2,3]
    },
    {
        label:"Create Records",
        value:"CreateRecords",
        screenName:'CreateEditRecords',
        icon:'add-outline',
        visibleToGuest:false,
        visbleTo:[1,2,3]
    },
    {
        label:"Login",
        value:"Login",
        screenName:'Login',
        icon:'log-in-outline',
        visibleToGuest:true,
        visbleTo:[]
    },
    {
        label:"Register",
        value:"Register",
        screenName:'Register',
        icon:'book-outline',
        visibleToGuest:false,
        visbleTo:[1]
    },
    {
        label:"Log Out",
        value:"Log Out",
        screenName:'Log Out',
        icon:'log-out-outline',
        visibleToGuest:false,
        visbleTo:[1,2,3]
    }
]