import { Column } from '@/types/Zodtype'
const renderSelect = (columns:Column[]) => {
    return columns?.map((item, index) => {
        return (
        <option key={index} value={item._id}>
            {item.name}
        </option>
        );
    });
    };

export default renderSelect;