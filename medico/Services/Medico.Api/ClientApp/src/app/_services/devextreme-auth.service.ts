import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DevextremeAuthService {
    //this method is used for passing cookie to request when the request is made by devextreme component datasource
    //this decorator is applied only when we are in development mode
    decorateOnBeforeSendMethod(onBeforeSendMethod: (method: string, ajaxOptions) => void, context: any) {
        return (method: string, ajaxOptions) => {
            if (!environment.production) {
                ajaxOptions.xhrFields = {
                    withCredentials: true
                }
            }
            
            onBeforeSendMethod.call(context, method, ajaxOptions);
        }
    }
}