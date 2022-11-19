export function formatSuccessfullResponse(data: any) {
  let result = {
    status: 'success',
    data: {} as any,
  };
  if (Array.isArray(data)) {
    result.data.count = data.length;
    result.data.items = data;
  } else {
    result.data = data;
  }

  return result;
}
