import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICrudOperationProps {
 ListName:string;
 siteurl:string;
 context:WebPartContext;
}
