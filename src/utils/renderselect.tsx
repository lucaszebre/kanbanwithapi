import type { Column } from "@/types/Zodtype";
export const renderSelect = (columns: Column[]) => {
  return columns?.map((item, index) => {
    return (
      <option key={index} value={item.id}>
        {item.name}
      </option>
    );
  });
};
