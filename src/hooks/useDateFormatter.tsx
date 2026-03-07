import { useState, useEffect } from "react";

export const useDateFormatter = (dateString: string) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    function formatDate() {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }

    setFormattedDate(formatDate());
  }, [dateString]);

  return formattedDate;
};
