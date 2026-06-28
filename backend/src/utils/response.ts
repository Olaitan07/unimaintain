export function successResponse<T>(data: T) {
  return { success: true, data };
}

export function errorResponse(message: string, details: unknown = null) {
  return { success: false, error: { message, details } };
}
