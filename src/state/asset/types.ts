// export interface AssetRequest{
//     name:string,
//     description:string,
//     image:string,
//     serialNumber:string,
//     status:Status,
//     purchaseDate:string,
//     price:number,
//     categoryId:number,
//     locationId:number,
//     assignedUserId:number
// }
// export enum Status{
//     IN_USE='IN_USE',
//     AVAILABLE='AVAILABLE',
//     MAINTENANCE='MAINTENANCE',
//     RETIRED='RETIRED',
// }
//
//
// export interface AssetResponse{
//     id:number,
//     name:string,
//     description:string,
//     image:string,
//     serialNumber:string,
//     status:Status,
//     purchaseDate:string,
//     price:number,
//     categoryId:number,
//     locationId:number,
//     assignedUserId:number
// }
//
// export interface AssetHistoryResponse{
//     assetId:number,
//     userId:number,
//     previousStatus:Status,
//     newStatus:Status,
//     changeDate:string,
//     remarks:string
// }