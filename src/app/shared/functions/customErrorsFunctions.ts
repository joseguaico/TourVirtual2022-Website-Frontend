
export function erroresApiArrayToString(erroresValidacionApi: any) : string{
    let propertiesKey = Object.getOwnPropertyNames(erroresValidacionApi);
    let propertyMessages: string[] = [];
   
    propertiesKey.forEach(element => {
      erroresValidacionApi[element].forEach((item:string) => {
        propertyMessages.push(item);
      });
    });
    return propertyMessages.join(', ');
}


export function erroresApiArrayToStringArray(erroresValidacionApi: any) : string[]{
    let propertiesKey = Object.getOwnPropertyNames(erroresValidacionApi);
    let propertyMessages: string[] = [];
   
    propertiesKey.forEach(element => {
      erroresValidacionApi[element].forEach((item:string) => {
        propertyMessages.push(item);
      });
    });
    return propertyMessages;
}


