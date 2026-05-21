import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const useKeyboardShortcuts = (filteredItems) => {
  const {
    focusedItemIndex,
    setFocusedItemIndex,
    approveItem,
    holdItem
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if the user is typing in inputs or textareas
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'j') {
        e.preventDefault();
        setFocusedItemIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
      } else if (key === 'k') {
        e.preventDefault();
        setFocusedItemIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (key === 'a') {
        e.preventDefault();
        const currentItem = filteredItems[focusedItemIndex];
        if (currentItem && currentItem.status === 'PENDING') {
          approveItem(currentItem.id);
        }
      } else if (key === 'h') {
        e.preventDefault();
        const currentItem = filteredItems[focusedItemIndex];
        if (currentItem && currentItem.status === 'PENDING') {
          holdItem(currentItem.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, focusedItemIndex, approveItem, holdItem, setFocusedItemIndex]);
};
