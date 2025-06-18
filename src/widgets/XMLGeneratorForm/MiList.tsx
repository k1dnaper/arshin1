import React from 'react';
import { DynamicList, DynamicItem, RemoveBtn } from './MiList.styled';
import styled from 'styled-components';

const miTypeOptions = [
  { value: '44154-20', title: 'Интеграл С-01' },
  { value: '83109-21', title: 'СОСпр-2б-2-000' },
  { value: '40929-09', title: 'СЧЕТ-1М' },
  { value: '19325-12', title: 'Ротаметр РМ-А' },
  { value: '82393-21', title: 'ИВА-6' },
  { value: '58550-14', title: 'Мультиметр DT-9915' },
  { value: '31772-06', title: 'Мультиметр 64' },
  { value: '37469-08', title: 'АКИП-1102' },
  { value: '53505-13', title: 'Testo 622' },
  { value: '5738-76', title: 'БАММ-1' },
  { value: '3744-73', title: 'М-67' },
  { value: '24248-09', title: 'ТК ПКМ' },
  { value: '53668-13', title: 'Мегаомметр' },
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

export interface MiItem {
  typeNum: string;
  manufactureNum: string;
}

interface Props {
  value: MiItem[];
  onChange: (value: MiItem[]) => void;
}

export const MiList: React.FC<Props> = ({ value, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...value,
      { typeNum: '', manufactureNum: '' },
    ]);
  };
  const handleRemove = (idx: number) => {
    const newList = value.slice();
    newList.splice(idx, 1);
    onChange(newList);
  };
  const handleChange = (idx: number, field: keyof MiItem, val: string) => {
    const newList = value.slice();
    newList[idx][field] = val;
    onChange(newList);
  };
  return (
    <div>
      <button type="button" onClick={handleAdd}>Добавить СИ</button>
      <DynamicList>
        {value.map((item, idx) => (
          <DynamicItem key={idx}>
            <StyledSelect
              value={miTypeOptions.some(opt => opt.value === item.typeNum) ? item.typeNum : 'other'}
              onChange={e => {
                if (e.target.value === 'other') {
                  handleChange(idx, 'typeNum', '');
                } else {
                  handleChange(idx, 'typeNum', e.target.value);
                }
              }}
            >
              <option value="">Выберите СИ</option>
              {miTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value} title={opt.title}>{opt.value}</option>
              ))}
              <option value="other">Другое...</option>
            </StyledSelect>
            {(!miTypeOptions.some(opt => opt.value === item.typeNum)) && (
              <input
                type="text"
                placeholder="Введите тип СИ"
                value={item.typeNum}
                onChange={e => handleChange(idx, 'typeNum', e.target.value)}
              />
            )}
            <input
              type="text"
              placeholder="Заводской номер"
              value={item.manufactureNum}
              onChange={e => handleChange(idx, 'manufactureNum', e.target.value)}
            />
            <RemoveBtn type="button" onClick={() => handleRemove(idx)}>Удалить</RemoveBtn>
          </DynamicItem>
        ))}
      </DynamicList>
    </div>
  );
}; 