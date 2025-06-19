import React from 'react';
import { DynamicItem, RemoveBtn } from './UveList.styled';
import { DynamicList } from '../../shared/ui/DynamicList.styled';
import styled from 'styled-components';
import { UVE_OPTIONS } from '../../shared/constants';

const StyledSelect = styled.select`
  width: auto;
  min-width: 100px;
  max-width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

interface UveItem {
  number: string;
}

interface Props {
  value: UveItem[];
  onChange: (value: UveItem[]) => void;
}

export const UveList: React.FC<Props> = ({ value, onChange }) => {
  const handleAdd = () => {
    onChange([...value, { number: '' }]);
  };
  const handleRemove = (idx: number) => {
    const newList = value.slice();
    newList.splice(idx, 1);
    onChange(newList);
  };
  const handleChange = (idx: number, val: string) => {
    const newList = value.slice();
    newList[idx].number = val;
    onChange(newList);
  };
  return (
    <div>
      <button type="button" onClick={handleAdd}>Добавить Эталон</button>
      <DynamicList>
        {value.map((item, idx) => (
          <DynamicItem key={idx}>
            <StyledSelect
              value={UVE_OPTIONS.some(opt => opt.value === item.number) ? item.number : 'other'}
              onChange={e => {
                if (e.target.value === 'other') {
                  handleChange(idx, '');
                } else {
                  handleChange(idx, e.target.value);
                }
              }}
            >
              <option value="">Выберите эталон</option>
              {UVE_OPTIONS.map((opt: { value: string; title?: string }) => (
                <option key={opt.value} value={opt.value} title={opt.title || opt.value}>{opt.value}</option>
              ))}
              <option value="other">Другое...</option>
            </StyledSelect>
            {(!UVE_OPTIONS.some(opt => opt.value === item.number)) && (
              <input
                type="text"
                placeholder="Введите номер эталона"
                value={item.number}
                onChange={e => handleChange(idx, e.target.value)}
              />
            )}
            <RemoveBtn type="button" onClick={() => handleRemove(idx)}>Удалить</RemoveBtn>
          </DynamicItem>
        ))}
      </DynamicList>
    </div>
  );
}; 