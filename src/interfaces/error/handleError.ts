export interface HandleError extends Error {
    response: {
      data : {
        httpStatus: number
        errorCode: string
        errorMessage: string
      }
    }
  }