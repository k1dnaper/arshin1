import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { DynamicList, MiBlock, MiHeader, RemoveBtn } from './ManufactureNumList.styled';

export interface ManufactureNum {
  num: string;
  year: string;
  modification: string;
  structure: string;
  additionalInfo: string;
}

interface Props {
  value: ManufactureNum[];
  onChange: (value: ManufactureNum[]) => void;
}

export const ManufactureNumList: React.FC<Props> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    onChange([
      ...value,
      { num: '', year: '', modification: '', structure: '', additionalInfo: '' },
    ]);
  };

  const handleRemove = (idx: number) => {
    const newList = value.slice();
    newList.splice(idx, 1);
    onChange(newList);
  };

  const handleChange = (idx: number, field: keyof ManufactureNum, val: string) => {
    const newList = value.slice();
    newList[idx][field] = val;
    onChange(newList);
  };

  const handleExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      const newList: ManufactureNum[] = (jsonData as any[]).map(row => ({
        num: row['Заводской номер'] || row['Номер'] || '',
        year: row['Год выпуска'] || '',
        modification: row['Модификация'] || '',
        structure: row['Состав СИ'] || '',
        additionalInfo: row['Прочие сведения'] || row['Примечание'] || '',
      }));
      onChange(newList);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  return (
    <div>
      <button type="button" onClick={handleAdd}>Добавить номер СИ</button>
      <button type="button" onClick={() => fileInputRef.current?.click()}>Загрузить из Excel</button>
      <input
        type="file"
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleExcel}
      />
      <DynamicList>
        {value.map((item, idx) => (
          <MiBlock key={idx}>
            <MiHeader>
              <input type="text" placeholder="Заводской номер" value={item.num} onChange={e => handleChange(idx, 'num', e.target.value)} />
              <input type="text" placeholder="Год выпуска" value={item.year} onChange={e => handleChange(idx, 'year', e.target.value)} />
              <input type="text" placeholder="Модификация" value={item.modification} onChange={e => handleChange(idx, 'modification', e.target.value)} />
              <RemoveBtn type="button" onClick={() => handleRemove(idx)}>Удалить</RemoveBtn>
            </MiHeader>
            <div style={{ marginTop: 8 }}>
              <label>Состав СИ, представленного на поверку</label>
              <input type="text" placeholder="Состав СИ" value={item.structure} onChange={e => handleChange(idx, 'structure', e.target.value)} />
            </div>
            <div style={{ marginTop: 8 }}>
              <label>Прочие сведения</label>
              <input type="text" placeholder="Прочие сведения" value={item.additionalInfo} onChange={e => handleChange(idx, 'additionalInfo', e.target.value)} />
            </div>
          </MiBlock>
        ))}
      </DynamicList>
    </div>
  );
}; 