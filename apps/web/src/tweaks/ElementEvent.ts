// This is a helper function to prevent the default behavior of the event and stop the event from bubbling up the DOM tree.
//INFO: This can prevent event bubbling while drag and drop.
export const onDropTweak = <T>(
  event: React.DragEvent<T>,
  callback: null | ((event: React.DragEvent<T>) => void | Promise<void>)
) => {
  event.preventDefault();
  event.stopPropagation();
  if (callback) callback(event);
};
