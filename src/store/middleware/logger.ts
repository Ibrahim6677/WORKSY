const logger = (store: any) => (next: any) => (action: any) => {
  console.log("Dispatching:", action);
  const result = next(action);
  console.log("Next state:", store.getState());
  return result;
};

export default logger;
