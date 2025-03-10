export enum Permissions {
    GET_ALL_PROJECT = 'PROJECT.GETALL',
    GET_PROJECT_BY_ID ='PROJECT.GETBYID',
    CREATE_PROJECT = 'PROJECT.CREATE',    
    UPDATE_PROJECT = 'PROJECT.UPDATE',   
    ARCHIVE_PROJECT = 'PROJECT.ARCHIVE', 
    VIEW_PROJECT='PROJECT.VIEW',   

    CREATE_USER = 'USER.CREATE',
    INACTIVE_USER = 'USER.INACTIVE',
    UPDATE_USER = 'USER.UPDATE',
    ARCHIVE_USER = 'USER.ARCHIVE',
    GET_ALL_USER = 'USER.GETALL',
    GET_USER_BY_ID ='USER.GETBYID',  

    CREATE_CONTACT = 'CONTACT.CREATE',   
    UPDATE_CONTACT = 'CONTACT.UPDATE',
    ARCHIVE_CONTACT = 'CONTACT.ARCHIVE',
    GET_ALL_CONTACT = 'CONTACT.GETALL',
    GET_CONTACT_BY_ID = 'CONTACT.GETBYID',
    VIEW_CONTACT='CONTACT.VIEW',

    CREATE_INDUCTION = 'INDUCTION.CREATE',
    UPDATE_INDUCTION = 'INDUCTION.UPDATE',
    GET_ALL_INDUCTION = 'INDUCTION.GETALL',
    GET_INDUCTION_BY_ID = 'INDUCTION.GETBYID',
    VIEW_INDUCTION='INDUCTION.VIEW',
    PRINT_INDUCTION='INDUCTION.PRINT',
    APPROVE_INDUCTION='INDUCTION.APPROVE',

    CREATE_WEEKLY_CHECK='WEEKLYCHECK.CREATE',
    GET_ALL_WEEKLY_CHECK ='WEEKLYCHECK.GETALL',
    GET_WEEKLY_CHECK_BY_ID='WEEKLYCHECK.GETBYID',
    UPDATE_WEEKLY_CHECK='WEEKLYCHECK.UPDATE',
    ARCHIVE_WEEKLY_CHECK='WEEKLYCHECK.ARCHIVE',
    VIEW_WEEKLY_CHECK='WEEKLYCHECK.VIEW', 

    CREATE_DAILY_CHECK='DAILYCHECK.CREATE',
    GET_ALL_DAILY_CHECK ='DAILYCHECK.GETALL',
    GET_DAILY_CHECK_BY_ID='DAILYCHECK.GETBYID',
    UPDATE_DAILY_CHECK='DAILYCHECK.UPDATE',
    ARCHIVE_DAILY_CHECK='DAILYCHECK.ARCHIVE',
    VIEW_DAILY_CHECK='DAILYCHECK.VIEW', 

    CREATE_HOT_WORK_PERMIT ='HOTPERMIT.CREATE',
    UPDATE_HOT_WORK_PERMIT = 'HOTPERMIT.UPDATE',
    GET_ALL_HOT_WORK_PERMIT = 'HOTPERMIT.GETALL',
    GET_BY_ID_HOT_WORK_PERMIT = 'HOTPERMIT.GETBYID',
    VIEW_HOT_WORK_PERMIT = 'HOTPERMIT.VIEW',
    ARCHIVE_HOT_WORK_PERMIT = 'HOTPERMIT.ARCHIVE',
    AUTHORISE_HOT_WORK_PERMIT = 'HOTPERMIT.AUTHORISE',
    CANCEL_HOT_WORK_PERMIT = 'HOTPERMIT.CANCEL',

    CREATE_HEIGHT_WORK_PERMIT ='HEIGHTPERMIT.CREATE',
    UPDATE_HEIGHT_WORK_PERMIT = 'HEIGHTPERMIT.UPDATE',
    GET_ALL_HEIGHT_WORK_PERMIT = 'HEIGHTPERMIT.GETALL',
    GET_BY_ID_HEIGHT_WORK_PERMIT = 'HEIGHTPERMIT.GETBYID',
    VIEW_HEIGHT_WORK_PERMIT = 'HEIGHTPERMIT.VIEW',
    ARCHIVE_HEIGHT_WORK_PERMIT = 'HEIGHTPERMIT.ARCHIVE',
    AUTHORISE_HEIGHT_WORK_PERMIT='HEIGHTPERMIT.AUTHORISE',    
    CANCEL_HEIGHT_WORK_PERMIT='HEIGHTPERMIT.CANCEL',

    GET_ALL_ACCIDENT_INCIDENT='ACCIDENTINCIDENT.GETALL',
    CREATE_ACCIDENT_INCIDENT='ACCIDENTINCIDENT.CREATE',
    UPDATE_ACCIDENT_INCIDENT='ACCIDENTINCIDENT.UPDATE',  
    GET_BY_ID_ACCIDENT_INCIDENT='ACCIDENTINCIDENT.GETBYID',
    VIEW_ACCIDENT_INCIDENT='ACCIDENTINCIDENT.VIEW',
    ARCHIVE_ACCIDENT_INCIDENT='ACCIDENTINCIDENT.ARCHIVE',


    
    VIEW_TIMESHEET = 'TIMESHEET.VIEW',
    PRINT_TIMESHEET='TIMESHEET.PRINT'

 
  }