import { Column } from '@/types/Zodtype'
import React from 'react'
const renderSelect = (columns:Column[]) => {
    return columns?.map((item, index) => {
        return (
        <option key={index} value={item.id}>
            {item.name}
        </option>
        );
    });
    };

export default renderSelect;