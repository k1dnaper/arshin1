import React from 'react';
import { DynamicItem, RemoveBtn } from './SesList.styled';
import { DynamicList } from '../../shared/ui/DynamicList.styled';
import styled from 'styled-components';

const seTypeOptions = [
  { value: 'ГСО 10597-2015', title: 'Смесь в азоте' },
  { value: 'ГСО 10599-2015', title: 'Смесь в воздухе' },
];

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

export interface SesItem {
  typeNum: string;
  manufactureYear: string;
  manufactureNum: string;
  metroChars: string;
}

interface Props {
  value: SesItem[];
  onChange: (value: SesItem[]) => void;
}

export const SesList: React.FC<Props> = ({ value, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...value,
      { typeNum: '', manufactureYear: '', manufactureNum: '', metroChars: '' },
    ]);
  };
  const handleRemove = (idx: number) => {
    const newList = value.slice();
    newList.splice(idx, 1);
    onChange(newList);
  };
  const handleChange = (idx: number, field: keyof SesItem, val: string) => {
    const newList = value.slice();
    newList[idx][field] = val;
    onChange(newList);
  };
  return (
    <div>
      <button type="button" onClick={handleAdd}>Добавить образец</button>
      <DynamicList>
        {value.map((item, idx) => (
          <DynamicItem key={idx}>
            <StyledSelect
              value={seTypeOptions.some(opt => opt.value === item.typeNum) ? item.typeNum : 'other'}
              onChange={e => {
                if (e.target.value === 'other') {
                  handleChange(idx, 'typeNum', '');
                } else {
                  handleChange(idx, 'typeNum', e.target.value);
                }
              }}
            >
              <option value="">Выберите СО</option>
              {seTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value} title={opt.title}>{opt.value}</option>
              ))}
              <option value="other">Другое...</option>
            </StyledSelect>
            {(!seTypeOptions.some(opt => opt.value === item.typeNum)) && (
              <input
                type="text"
                placeholder="Введите номер СО"
                value={item.typeNum}
                onChange={e => handleChange(idx, 'typeNum', e.target.value)}
              />
            )}
            <input
              type="text"
              placeholder="Год выпуска"
              value={item.manufactureYear}
              onChange={e => handleChange(idx, 'manufactureYear', e.target.value)}
            />
            <input
              type="text"
              placeholder="Заводской номер"
              value={item.manufactureNum}
              onChange={e => handleChange(idx, 'manufactureNum', e.target.value)}
            />
            <input
              type="text"
              placeholder="Метрологические характеристики СО"
              value={item.metroChars}
              onChange={e => handleChange(idx, 'metroChars', e.target.value)}
            />
            <RemoveBtn type="button" onClick={() => handleRemove(idx)}>Удалить</RemoveBtn>
          </DynamicItem>
        ))}
      </DynamicList>
    </div>
  );
}; 