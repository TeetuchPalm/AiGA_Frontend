export const convertDate = (date: Date | undefined): string => {
    if(!date) return ''
    const dt:Date = new Date(date)
    const yyyy:number = dt?.getFullYear()
    const mm:number = dt.getMonth() + 1
    const dd:number = dt?.getDate()
    return (dd < 10 ? '0' + dd : dd) + '/' + (mm < 10 ? '0' + mm : mm) + '/' + yyyy
  }
  
  export const getTime = (date: Date| undefined): string => {
    if(!date) return ''
    return new Date(date).toTimeString().substring(0, 5)
  }