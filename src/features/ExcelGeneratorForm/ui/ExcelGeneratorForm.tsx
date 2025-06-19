import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import {
  PageWrapper,
  FormWrapper,
  Title,
  FileInputLabel,
  FileInput,
  InfoText,
  FlexRow,
  TextInput,
  AddButton,
  RemoveButton,
  AddressRow,
  GenerateButton,
  ErrorText
} from './ExcelGeneratorForm.styled';

// Вспомогательная функция для декодирования буквы столбца в индекс
function decodeCol(col: string): number {
  let n = 0;
  for (let i = 0; i < col.length; ++i) {
    n = n * 26 + (col.charCodeAt(i) - 64);
  }
  return n - 1;
}

const ExcelGeneratorForm: React.FC = () => {
  const [mainBuffer, setMainBuffer] = useState<ArrayBuffer | null>(null);
  const [secondBuffer, setSecondBuffer] = useState<ArrayBuffer | null>(null);
  const [cellAddresses, setCellAddresses] = useState<string[]>(['']);
  const [companyName, setCompanyName] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [serialCol, setSerialCol] = useState('');
  const [replaceError, setReplaceError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setMainBuffer(evt.target?.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSecondFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setSecondBuffer(evt.target?.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddressChange = (idx: number, value: string) => {
    setCellAddresses(prev => prev.map((addr, i) => (i === idx ? value.toUpperCase() : addr)));
  };

  const handleAddAddress = () => {
    setCellAddresses(prev => [...prev, '']);
  };

  const handleRemoveAddress = (idx: number) => {
    setCellAddresses(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMassReplaceAndZip = async () => {
    setReplaceError(null);
    if (!mainBuffer || !secondBuffer) {
      setReplaceError('Загрузите оба файла.');
      return;
    }
    if (cellAddresses.length === 0 || cellAddresses.some(addr => !addr)) {
      setReplaceError('Заполните все адреса ячеек.');
      return;
    }
    if (!companyName) {
      setReplaceError('Введите название фирмы.');
      return;
    }
    if (!dateValue) {
      setReplaceError('Введите дату.');
      return;
    }
    if (!serialCol) {
      setReplaceError('Укажите столбец для заводского номера.');
      return;
    }
    setIsGenerating(true);
    try {
      // Читаем основной файл
      const mainWb = new ExcelJS.Workbook();
      await mainWb.xlsx.load(mainBuffer);
      // Читаем второй файл
      const secondWb = new ExcelJS.Workbook();
      await secondWb.xlsx.load(secondBuffer);
      // Получаем все строки второго файла (начиная со 2-й)
      const ws = secondWb.worksheets[0];
      const rows: Array<Array<string | number | null>> = [];
      ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) { // пропускаем заголовок
          rows.push(row.values as Array<string | number | null>);
        }
      });
      // Определяем индекс столбца для заводского номера
      const serialColIdx = decodeCol(serialCol);
      // Для каждой строки создаём копию файла и подставляем значения
      const zip = new JSZip();
      for (let i = 0; i < rows.length; ++i) {
        const row = rows[i] || [];
        // Копируем основной файл
        const wbCopy = new ExcelJS.Workbook();
        await wbCopy.xlsx.load(mainBuffer);
        const wsCopy = wbCopy.worksheets[0];
        // Вставляем значения по адресам
        cellAddresses.forEach((addr, idx) => {
          const value = row[idx + 1]; // ExcelJS getSheetValues 1-based
          const cell = wsCopy.getCell(addr);
          cell.value = value;
          // Можно добавить копирование стилей, если нужно
        });
        // Формируем имя файла
        const serialValue = row[serialColIdx + 1] ?? '';
        // Форматируем дату в ДД.ММ.ГГГГ
        let formattedDate = dateValue;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          const [yyyy, mm, dd] = dateValue.split('-');
          formattedDate = `${dd}.${mm}.${yyyy}`;
        }
        const fileName = `${companyName} №${serialValue} от ${formattedDate}`
          .replace(/\/+/, ' ')
          .replace(/[^a-zA-Zа-яА-Я0-9 №\-\.]/g, '');
        // Генерируем файл в память
        const fileData = await wbCopy.xlsx.writeBuffer();
        zip.file(`${fileName || 'modified'}.xlsx`, fileData);
      }
      // Генерируем zip и скачиваем
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'modified_excels.zip');
    } catch (e) {
      setReplaceError('Ошибка при генерации файлов: ' + (e as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Генератор Excel</Title>
        <div>
          <FileInputLabel>Загрузите основной Excel-файл:</FileInputLabel>
          <FileInput type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
        </div>
        <div>
          <FileInputLabel>Загрузите второй Excel-файл (с новыми значениями):</FileInputLabel>
          <FileInput type="file" accept=".xlsx,.xls" onChange={handleSecondFileUpload} />
          <InfoText>
            <b>Внимание:</b> В&nbsp;этом файле первая строка должна содержать заголовки столбцов, а&nbsp;данные начинаться со&nbsp;второй строки.
          </InfoText>
        </div>
        <FlexRow>
          <div style={{ flex: 1 }}>
            <FileInputLabel>Название фирмы:</FileInputLabel>
            <TextInput
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="Название фирмы"
            />
          </div>
        </FlexRow>
        <FlexRow style={{ marginTop: 18 }}>
          <div style={{ flex: 1 }}>
            <FileInputLabel>Дата:</FileInputLabel>
            <TextInput
              type="date"
              value={dateValue}
              onChange={e => setDateValue(e.target.value)}
              placeholder="Дата (например, 2024-06-20)"
            />
          </div>
        </FlexRow>
        <FlexRow>
          <div style={{ flex: 1 }}>
            <FileInputLabel>Столбец для заводского номера (например, A, B, C):</FileInputLabel>
            <TextInput
              type="text"
              value={serialCol}
              onChange={e => setSerialCol(e.target.value.toUpperCase())}
              placeholder="A"
              maxLength={2}
            />
          </div>
        </FlexRow>
        <div>
          <FileInputLabel>Адреса ячеек для замены (например, A1, B2):</FileInputLabel>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cellAddresses.map((addr, idx) => (
              <AddressRow key={idx}>
                <TextInput
                  type="text"
                  value={addr}
                  onChange={e => handleAddressChange(idx, e.target.value)}
                  placeholder="A1"
                  maxLength={5}
                />
                <RemoveButton type="button" onClick={() => handleRemoveAddress(idx)} disabled={cellAddresses.length === 1}>
                  Удалить
                </RemoveButton>
              </AddressRow>
            ))}
            <AddButton type="button" onClick={handleAddAddress}>Добавить адрес</AddButton>
          </div>
        </div>
        <GenerateButton
          onClick={handleMassReplaceAndZip}
          disabled={isGenerating}
        >
          {isGenerating ? 'Генерация...' : 'Сгенерировать и скачать zip'}
        </GenerateButton>
        {replaceError && <ErrorText>{replaceError}</ErrorText>}
      </FormWrapper>
    </PageWrapper>
  );
};

export { ExcelGeneratorForm }; 