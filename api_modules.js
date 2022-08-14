// // *when you login*
// API  - https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/login
// Data -  {"data":{"email":"ravidirect@gmail.comdc1x","socialid":"ABCD","fname":"Ravi","lname":"K","gender":"m","profile":"XYZ","status":"1","module_list":"yes","cat_list":"yes","ledger_list":"yes"}}
// // Info - this will give users details and list of all modules, their respective cat and their respective ledger

// // *use this to refresh or get entire records for a user*
// API  - https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/user_refresh
// Data -   {"data":{"userid":"3","module_list":"yes","cat_list":"yes","ledger_list":"yes"}}
// // Info - this will give users details and list of all modules, their respective cat and their respective ledger

// // *for selected user get all records for a module*
// API  - https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_list
// Data -  {"data":{"userid":"1","moduleid":"1"  }}
 
// // *for selected user get all records for a module and cat*
// API  - https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_list
// Data -  {"data":{"userid":"1","moduleid":"1","catid":"1"  }}

// // *add new cat for user *
// API  -  https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/cat_add
// Data - {"data":{"userid":"1","moduleid":"1", "cat":"ABCZ3ss"}}
 
// // *add a ledger record*
// API  - https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_add
// Data -  {"data":{"userid":"1","moduleid":"1", "catid":"1","name":"Test1","notes":"Note1","remind":"1","reminds":"1" ,"remindf":"1" ,"status":"1" }}
 
// // *delete a ledger record*
// API  - https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_delete
// Data - {"data":{"id":"2","userid":"1"  }}
 
// // *set a ledger as favourite*
// API  - https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_favourite
// Data -  {"data":{"id":"2","userid":"1" ,"fav":"1"  }}

// *set a ledger as NOT favourite*
// API  - https://www.schoolwise.in/apimobile/notewise/depot/walnut/hRs6/21/ledger_favourite
// Data -  {"data":{"id":"2","userid":"1" ,"fav":"0"  }}