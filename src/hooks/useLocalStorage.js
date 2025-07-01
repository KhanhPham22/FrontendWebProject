// useLocalStorage.js
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item && item !== "undefined") {
        const parsed = JSON.parse(item);
        // Ensure all days are arrays for mealPlan
        if (key === "mealPlan" && parsed && typeof parsed === "object") {
          const defaultPlan = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
          };
          return Object.keys(defaultPlan).reduce((acc, day) => ({
            ...acc,
            [day]: Array.isArray(parsed[day]) ? parsed[day] : [],
          }), {});
        }
        return parsed;
      }
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Deep comparison to avoid unnecessary updates
      if (JSON.stringify(valueToStore) !== JSON.stringify(storedValue)) {
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}