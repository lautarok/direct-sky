export const formatDate = (fromDate: string) => {
  const messageDate = new Date(fromDate),
  nowDate = new Date(new Date().toISOString()),
  ms = nowDate.getTime() - messageDate.getTime();

  const getDifference = (unit: number, difference: number) =>
    Math.floor(difference / unit);

  if(ms < 60000) {
    return 'Just now';
  } else if(ms < 3600000) {
    return `${getDifference(60000, ms)}m ago`;
  } else if(ms < 86400000) {
    const difference = getDifference(3600000, ms);
    return `${getDifference(3600000, ms)}h ago`;
  } else if(ms < 172800000) {
    return `Yersterday`;
  } else if(nowDate.getFullYear() === messageDate.getFullYear()) {
    return `${messageDate.getDate()}/${messageDate.getMonth() + 1}`;
  } else {
    return `${messageDate.getDate()}/${messageDate.getMonth() + 1}/${messageDate.getFullYear()}`;
  }
}