import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

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
      const rows = secondWb.worksheets[0].getSheetValues().slice(2) as any[]; // 0 - undefined, 1 - заголовки
      // Определяем индекс столбца для заводского номера
      const serialColIdx = decodeCol(serialCol);
      // Для каждой строки создаём копию файла и подставляем значения
      const zip = new JSZip();
      for (let i = 0; i < rows.length; ++i) {
        const row: any[] = rows[i] || [];
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
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '40px 0', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        maxWidth: 520,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 0 10px rgba(58, 41, 41, 0.1)',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        <h2 style={{ textAlign: 'center', color: '#333', fontWeight: 700, fontSize: 26, margin: 0 }}>Генератор Excel</h2>
        <div>
          <label style={{ fontWeight: 500, color: '#222', marginBottom: 10, display: 'block' }}>Загрузите основной Excel-файл:</label>
          <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} style={{ marginTop: 8, width: '100%', padding: 10, border: '1px solid #bdbdbd', borderRadius: 6, fontSize: 16, background: '#fff' }} />
        </div>
        <div>
          <label style={{ fontWeight: 500, color: '#222', marginBottom: 10, display: 'block' }}>Загрузите второй Excel-файл (с новыми значениями):</label>
          <input type="file" accept=".xlsx,.xls" onChange={handleSecondFileUpload} style={{ marginTop: 8, width: '100%', padding: 10, border: '1px solid #bdbdbd', borderRadius: 6, fontSize: 16, background: '#fff' }} />
          <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
            <b>Внимание:</b> В&nbsp;этом файле первая строка должна содержать заголовки столбцов, а&nbsp;данные начинаться со&nbsp;второй строки.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, color: '#222', marginBottom: 10, display: 'block' }}>Название фирмы:</label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="Название фирмы"
              style={{ width: '100%', marginTop: 8, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16, background: '#fff' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, color: '#222', marginBottom: 10, display: 'block' }}>Дата:</label>
            <input
              type="date"
              value={dateValue}
              onChange={e => setDateValue(e.target.value)}
              placeholder="Дата (например, 2024-06-20)"
              style={{ width: '100%', marginTop: 8, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16, background: '#fff' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, color: '#222', marginBottom: 10, display: 'block' }}>Столбец для заводского номера (например, A, B, C):</label>
            <input
              type="text"
              value={serialCol}
              onChange={e => setSerialCol(e.target.value.toUpperCase())}
              placeholder="A"
              style={{ width: '100%', marginTop: 8, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16, background: '#fff' }}
              maxLength={2}
            />
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 500, color: '#222', marginBottom: 10, display: 'block' }}>Адреса ячеек для замены (например, A1, B2):</label>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cellAddresses.map((addr, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="text"
                  value={addr}
                  onChange={e => handleAddressChange(idx, e.target.value)}
                  placeholder="A1"
                  style={{ width: 80, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16, background: '#fff' }}
                  maxLength={5}
                />
                <button type="button" onClick={() => handleRemoveAddress(idx)} disabled={cellAddresses.length === 1}
                  style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 14px', cursor: cellAddresses.length === 1 ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: 15 }}>
                  Удалить
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddAddress} style={{ marginTop: 8, background: '#90EE90', color: '#222', border: 'none', borderRadius: 4, padding: '10px 18px', fontWeight: 500, fontSize: 16, cursor: 'pointer', alignSelf: 'flex-start', transition: 'background 0.3s' }}>Добавить адрес</button>
          </div>
        </div>
        <button style={{
          marginTop: 8,
          background: isGenerating ? '#6c757d' : '#90EE90',
          color: '#222',
          border: 'none',
          borderRadius: 4,
          padding: '14px 0',
          fontWeight: 700,
          fontSize: 18,
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          boxShadow: '0 2px 8px 0 rgba(60,80,180,0.07)'
        }} onClick={handleMassReplaceAndZip} disabled={isGenerating} onMouseOver={e => { if (!isGenerating) (e.currentTarget as HTMLButtonElement).style.background = '#28a745'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }} onMouseOut={e => { if (!isGenerating) (e.currentTarget as HTMLButtonElement).style.background = '#90EE90'; (e.currentTarget as HTMLButtonElement).style.color = '#222'; }}>
          {isGenerating ? 'Генерация...' : 'Сгенерировать и скачать zip'}
        </button>
        {replaceError && <div style={{ color: '#ef4444', fontWeight: 500, marginTop: 8, textAlign: 'center' }}>{replaceError}</div>}
      </div>
    </div>
  );
};

export { ExcelGeneratorForm }; 