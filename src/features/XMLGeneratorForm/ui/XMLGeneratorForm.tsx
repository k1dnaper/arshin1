import { type FC, useState, useEffect } from 'react';
import styles from './XMLGeneratorForm.module.css';
import type { XMLFormData, ManufactureNum } from '../../../shared/types';
import { UVE_OPTIONS, SE_TYPE_OPTIONS, MI_TYPE_OPTIONS, METROLOGIST_OPTIONS } from '../../../shared/constants';
import * as XLSX from 'xlsx';

const initialFormData: XMLFormData = {
  mitypeNumber: '',
  manufactureNums: [],
  signCipher: '',
  miOwner: '',
  vrfDate: '',
  interval: 1,
  type: '',
  calibration: false,
  stickerNum: '',
  signPass: false,
  signMi: false,
  docTitle: '',
  metrologist: '',
  conditions: {
    temperature: '',
    pressure: '',
    humidity: '',
    other: ''
  },
  uve: [],
  ses: [],
  mis: []
};

export const XMLGeneratorForm: FC = () => {
  const [formData, setFormData] = useState<XMLFormData>(initialFormData);

  const [generationCounter, setGenerationCounter] = useState<number>(
    Number(localStorage.getItem('xmlGenerationCounter')) || 0
  );

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'xml' | 'excel'>('xml');

  useEffect(() => {
    const savedData = localStorage.getItem('xmlFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (field: keyof XMLFormData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem('xmlFormData', JSON.stringify(newData));
  };

  const handleConditionsChange = (field: keyof typeof formData.conditions, value: string) => {
    const newConditions = { ...formData.conditions, [field]: value };
    handleInputChange('conditions', newConditions);
  };

  const handleManufactureNumChange = (index: number, field: keyof ManufactureNum, value: string) => {
    const newManufactureNums = [...formData.manufactureNums];
    newManufactureNums[index] = { ...newManufactureNums[index], [field]: value };
    handleInputChange('manufactureNums', newManufactureNums);
  };

  const addManufactureNum = () => {
    setFormData(prev => ({
      ...prev,
      manufactureNums: [...prev.manufactureNums, { num: '', year: '', modification: '', structure: '', additionalInfo: '' }]
    }));
  };

  const removeManufactureNum = (index: number) => {
    setFormData(prev => ({
      ...prev,
      manufactureNums: prev.manufactureNums.filter((_, i) => i !== index)
    }));
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const newManufactureNums = jsonData.map((row: any) => ({
          num: row['Заводской номер'] || row['Номер'] || '',
          year: row['Год выпуска'] || '',
          modification: row['Модификация'] || '',
          structure: row['Состав СИ'] || '',
          additionalInfo: row['Прочие сведения'] || row['Примечание'] || ''
        }));

        handleInputChange('manufactureNums', newManufactureNums);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const addUve = () => {
    const newUve = [...formData.uve, { number: '' }];
    handleInputChange('uve', newUve);
  };

  const removeUve = (index: number) => {
    const newUve = formData.uve.filter((_, i) => i !== index);
    handleInputChange('uve', newUve);
  };

  const addSes = () => {
    const newSes = [...formData.ses, { typeNum: '', manufactureYear: '', manufactureNum: '', metroChars: '' }];
    handleInputChange('ses', newSes);
  };

  const removeSes = (index: number) => {
    const newSes = formData.ses.filter((_, i) => i !== index);
    handleInputChange('ses', newSes);
  };

  const addMi = () => {
    const newMis = [...formData.mis, { typeNum: '', manufactureNum: '' }];
    handleInputChange('mis', newMis);
  };

  const removeMi = (index: number) => {
    const newMis = formData.mis.filter((_, i) => i !== index);
    handleInputChange('mis', newMis);
  };

  const clearAllFields = () => {
    setFormData(initialFormData);
    localStorage.removeItem('xmlFormData');
  };

  const generateXML = () => {
    if (generationCounter >= 100) {
      alert('Ошибка генерации');
      return;
    }

    const vrfDate = `${formData.vrfDate}+03:00`;
    const validDate = new Date(formData.vrfDate);
    validDate.setFullYear(validDate.getFullYear() + formData.interval);
    validDate.setDate(validDate.getDate() - 1);
    const formattedValidDate = `${validDate.toISOString().split('T')[0]}+03:00`;

    // Генерация XML по образцу
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<gost:application xmlns:gost="urn://fgis-arshin.gost.ru/module-verifications/import/2020-06-19">\n${formData.manufactureNums.map(mi => `        <gost:result>\n        <gost:miInfo>\n            <gost:singleMI>\n                <gost:mitypeNumber>${formData.mitypeNumber}</gost:mitypeNumber>\n                <gost:manufactureNum>${mi.num || 0}</gost:manufactureNum>\n                <gost:manufactureYear>${mi.year || 0}</gost:manufactureYear>\n                <gost:modification>${mi.modification || '-'}</gost:modification>\n            </gost:singleMI>\n        </gost:miInfo>\n        <gost:signCipher>${formData.signCipher || '-'}</gost:signCipher>\n        <gost:miOwner>${formData.miOwner || '-'}</gost:miOwner>\n        <gost:vrfDate>${vrfDate}</gost:vrfDate>\n        <gost:validDate>${formattedValidDate}</gost:validDate>\n        <gost:type>${formData.type === '1' || formData.type === '2' ? formData.type : '2'}</gost:type>\n        <gost:calibration>${formData.calibration ? 'true' : 'false'}</gost:calibration>\n        <gost:applicable>\n            \n            <gost:signPass>${formData.signPass ? 'true' : 'false'}</gost:signPass>\n            <gost:signMi>${formData.signMi ? 'true' : 'false'}</gost:signMi>\n        </gost:applicable>\n        <gost:docTitle>${formData.docTitle || '-'}</gost:docTitle>\n        <gost:metrologist>${formData.metrologist || '-'}</gost:metrologist>\n        <gost:means>\n            ${formData.ses.length > 0 ? `<gost:ses>\n${formData.ses.map(ses => `                <gost:se>\n                    <gost:typeNum>${ses.typeNum || '-'}</gost:typeNum>\n                    <gost:manufactureYear>${ses.manufactureYear || 0}</gost:manufactureYear>\n                    \n                    <gost:metroChars>${ses.metroChars || '-'}</gost:metroChars>\n                </gost:se>`).join('')}\n            </gost:ses>` : ''}
            ${formData.mis.length > 0 ? `<gost:mis>\n${formData.mis.map(mis => `                <gost:mi>\n                    <gost:typeNum>${mis.typeNum || '-'}</gost:typeNum>\n                    <gost:manufactureNum>${mis.manufactureNum || 0}</gost:manufactureNum>\n                </gost:mi>`).join('')}\n            </gost:mis>` : ''}
        </gost:means>\n        <gost:conditions>\n            <gost:temperature>${formData.conditions.temperature || '-'} °C</gost:temperature>\n            <gost:pressure>${formData.conditions.pressure || '-'} мм рт.ст.</gost:pressure>\n            <gost:hymidity>${formData.conditions.humidity || '-'} %</gost:hymidity>\n            <gost:other>${formData.conditions.other || '-'}</gost:other>\n        </gost:conditions>\n        \n        \n    </gost:result>`).join('    ')}\n</gost:application>`;

    const fileName = `${formData.mitypeNumber}_${formData.vrfDate}.xml`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    const newCounter = generationCounter + 1;
    setGenerationCounter(newCounter);
    localStorage.setItem('xmlGenerationCounter', newCounter.toString());
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          className={styles.topPanelBtn}
          style={{ background: activeTab === 'xml' ? '#28a745' : '#e0e0e0', color: activeTab === 'xml' ? '#fff' : '#222' }}
          onClick={() => setActiveTab('xml')}
        >
          Генератор XML
        </button>
        <button
          className={styles.topPanelBtn}
          style={{ background: activeTab === 'excel' ? '#007bff' : '#e0e0e0', color: activeTab === 'excel' ? '#fff' : '#222' }}
          onClick={() => setActiveTab('excel')}
        >
          Генератор Excel
        </button>
      </div>
      {activeTab === 'xml' ? (
        <>
          <p>Автор : <a href="https://t.me/kidnaper">Кучугуров И.В.</a></p>
          <p>Alpha v1.1 от 18.06.2025</p>
          <h2>Генератор массовой загрузки МИЦ</h2>
          <div className={styles.formGroup} style={{marginBottom: '20px'}}>
            <div className={styles.topPanel}>
              <button type="button" className={styles.topPanelBtn} onClick={addManufactureNum}>Добавить номер СИ</button>
              <button type="button" className={styles.topPanelBtn} onClick={() => document.getElementById('excelFile')?.click()}>Загрузить из Excel</button>
              <button type="button" className={styles.topPanelBtn} onClick={clearAllFields}>Очистить все поля</button>
              <button type="button" className={styles.topPanelBtn} onClick={() => setCollapsed(prev => !prev)}>
                {collapsed ? 'Развернуть все номера СИ' : 'Свернуть все номера СИ'}
              </button>
              <input
                type="file"
                id="excelFile"
                accept=".xlsx, .xls"
                style={{ display: 'none' }}
                onChange={handleExcelUpload}
              />
            </div>
            <div className={styles.dynamicList}>
              {formData.manufactureNums.map((num, index) => (
                <div key={index} className={styles.dynamicItem} style={{display: collapsed ? 'none' : 'flex'}}>
                  <div><input type="text" placeholder="Номер" value={num.num} onChange={e => handleManufactureNumChange(index, 'num', e.target.value)} /></div>
                  <div><input type="text" placeholder="Год выпуска" value={num.year} onChange={e => handleManufactureNumChange(index, 'year', e.target.value)} /></div>
                  <div><input type="text" placeholder="Модификация" value={num.modification} onChange={e => handleManufactureNumChange(index, 'modification', e.target.value)} /></div>
                  <div><input type="text" placeholder="Состав СИ" value={num.structure} onChange={e => handleManufactureNumChange(index, 'structure', e.target.value)} /></div>
                  <div><input type="text" placeholder="Прочие сведения" value={num.additionalInfo} onChange={e => handleManufactureNumChange(index, 'additionalInfo', e.target.value)} /></div>
                  <button className={styles.removeBtn} type="button" onClick={() => removeManufactureNum(index)}>Удалить</button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.formGroup_qnuk1}>
            <div>
              <label htmlFor="mitypeNumber">Номер описания типа:</label>
              <input
                id="mitypeNumber"
                type="text"
                value={formData.mitypeNumber}
                onChange={e => handleInputChange('mitypeNumber', e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="signCipher">Шифр</label>
              <input id="signCipher" type="text" value={formData.signCipher} onChange={e => handleInputChange('signCipher', e.target.value)} />
            </div>
            <div>
              <label htmlFor="miOwner">Владелец СИ</label>
              <input id="miOwner" type="text" value={formData.miOwner} onChange={e => handleInputChange('miOwner', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="vrfDate">Дата проверки</label>
              <input id="vrfDate" type="date" value={formData.vrfDate} onChange={e => handleInputChange('vrfDate', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="interval">Межповерочный интервал (лет):</label>
              <select id="interval" value={formData.interval} onChange={e => handleInputChange('interval', Number(e.target.value))} required>
                {[1,2,3,4,5].map(val => (<option key={val} value={val}>{val}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="type">Тип проверки:</label>
              <select id="type" value={formData.type} onChange={e => handleInputChange('type', e.target.value)} required>
                <option value="2">Периодическая</option>
                <option value="1">Первичная</option>
              </select>
            </div>
            <div>
              <label htmlFor="calibration">Калибровка:</label>
              <select id="calibration" value={String(formData.calibration)} onChange={e => handleInputChange('calibration', e.target.value === 'true')} required>
                <option value="false">нет</option>
                <option value="true">да</option>
              </select>
            </div>
            <div>
              <label htmlFor="stickerNum">Номер наклейки:</label>
              <input id="stickerNum" type="text" value={formData.stickerNum} onChange={e => handleInputChange('stickerNum', e.target.value)} />
            </div>
            <div>
              <label htmlFor="signPass">Знак поверки в паспорте</label>
              <select id="signPass" value={String(formData.signPass)} onChange={e => handleInputChange('signPass', e.target.value === 'true')} required>
                <option value="false">нет</option>
                <option value="true">да</option>
              </select>
            </div>
            <div>
              <label htmlFor="signMi">Знак поверки на СИ</label>
              <select id="signMi" value={String(formData.signMi)} onChange={e => handleInputChange('signMi', e.target.value === 'true')} required>
                <option value="false">нет</option>
                <option value="true">да</option>
              </select>
            </div>
            <div>
              <label htmlFor="docTitle">Методика поверки</label>
              <input id="docTitle" type="text" value={formData.docTitle} onChange={e => handleInputChange('docTitle', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="metrologist">Поверитель</label>
              <input list="metrologistList" id="metrologist" value={formData.metrologist} onChange={e => handleInputChange('metrologist', e.target.value)} required />
              <datalist id="metrologistList">
                {METROLOGIST_OPTIONS.map(name => (<option key={name} value={name} />))}
              </datalist>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Условия поверки</label>
            <div className={styles.formGroup_qnuk1}>
              <div>
                <label htmlFor="temperature">Температура (°C):</label>
                <input id="temperature" type="text" value={formData.conditions.temperature} onChange={e => handleConditionsChange('temperature', e.target.value)} required />
              </div>
              <div>
                <label htmlFor="pressure">Давление (мм рт.ст.):</label>
                <input id="pressure" type="text" value={formData.conditions.pressure} onChange={e => handleConditionsChange('pressure', e.target.value)} required />
              </div>
              <div>
                <label htmlFor="humidity">Влажность (%):</label>
                <input id="humidity" type="text" value={formData.conditions.humidity} onChange={e => handleConditionsChange('humidity', e.target.value)} required />
              </div>
              <div className={styles.fullWidthField}>
                <label htmlFor="other">Прочие условия:</label>
                <input id="other" type="text" value={formData.conditions.other} onChange={e => handleConditionsChange('other', e.target.value)} required />
              </div>
            </div>
          </div>
          <div className={styles.formGroup_qnuk1}>
            <div>
              <label>Эталоны, применяемые при поверке</label>
              <button type="button" onClick={addUve}>Добавить Эталон</button>
              <div className={styles.dynamicList}>
                {formData.uve.map((item, idx) => (
                  <div key={idx} className={styles.dynamicItemNarrow}>
                    <select value={item.number} onChange={e => {
                      const newUve = [...formData.uve];
                      newUve[idx] = { number: e.target.value };
                      handleInputChange('uve', newUve);
                    }}>
                      <option value="">Выберите эталон</option>
                      {UVE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} title={opt.title || opt.value}>{opt.value}</option>
                      ))}
                      <option value="other">Другое...</option>
                    </select>
                    {item.number === 'other' && (
                      <input type="text" placeholder="Введите номер эталона" value={item.custom || ''} onChange={e => {
                        const newUve = [...formData.uve];
                        newUve[idx] = { number: e.target.value, custom: e.target.value };
                        handleInputChange('uve', newUve);
                      }} />
                    )}
                    <button className={styles.removeBtn} type="button" onClick={() => removeUve(idx)}>Удалить</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label>Стандартные образцы, применяемые при поверке</label>
              <button type="button" onClick={addSes}>Добавить образец</button>
              <div className={styles.dynamicList}>
                {formData.ses.map((item, idx) => (
                  <div key={idx} className={styles.dynamicItemNarrow}>
                    <select value={item.typeNum} onChange={e => {
                      const newSes = [...formData.ses];
                      newSes[idx] = { ...item, typeNum: e.target.value };
                      handleInputChange('ses', newSes);
                    }}>
                      <option value="">Выберите СО</option>
                      {SE_TYPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} title={opt.title || opt.value}>{opt.value}</option>
                      ))}
                      <option value="other">Другое...</option>
                    </select>
                    {item.typeNum === 'other' && (
                      <input type="text" placeholder="Введите номер СО" value={item.custom || ''} onChange={e => {
                        const newSes = [...formData.ses];
                        newSes[idx] = { ...item, typeNum: e.target.value, custom: e.target.value };
                        handleInputChange('ses', newSes);
                      }} />
                    )}
                    <input type="text" placeholder="Год выпуска" value={item.manufactureYear} onChange={e => {
                      const newSes = [...formData.ses];
                      newSes[idx] = { ...item, manufactureYear: e.target.value };
                      handleInputChange('ses', newSes);
                    }} />
                    <input type="text" placeholder="Заводской номер" value={item.manufactureNum} onChange={e => {
                      const newSes = [...formData.ses];
                      newSes[idx] = { ...item, manufactureNum: e.target.value };
                      handleInputChange('ses', newSes);
                    }} />
                    <input type="text" placeholder="Метрологические характеристики СО" value={item.metroChars} onChange={e => {
                      const newSes = [...formData.ses];
                      newSes[idx] = { ...item, metroChars: e.target.value };
                      handleInputChange('ses', newSes);
                    }} />
                    <button className={styles.removeBtn} type="button" onClick={() => removeSes(idx)}>Удалить</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label>СИ, применяемые при поверке</label>
              <button type="button" onClick={addMi}>Добавить СИ</button>
              <div className={styles.dynamicList}>
                {formData.mis.map((item, idx) => (
                  <div key={idx} className={styles.dynamicItemNarrow}>
                    <select value={item.typeNum} onChange={e => {
                      const newMis = [...formData.mis];
                      newMis[idx] = { ...item, typeNum: e.target.value };
                      handleInputChange('mis', newMis);
                    }}>
                      <option value="">Выберите СИ</option>
                      {MI_TYPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} title={opt.title || opt.value}>{opt.value}</option>
                      ))}
                      <option value="other">Другое...</option>
                    </select>
                    {item.typeNum === 'other' && (
                      <input type="text" placeholder="Введите номер СИ" value={item.custom || ''} onChange={e => {
                        const newMis = [...formData.mis];
                        newMis[idx] = { ...item, typeNum: e.target.value, custom: e.target.value };
                        handleInputChange('mis', newMis);
                      }} />
                    )}
                    <input type="text" placeholder="Заводской номер" value={item.manufactureNum} onChange={e => {
                      const newMis = [...formData.mis];
                      newMis[idx] = { ...item, manufactureNum: e.target.value };
                      handleInputChange('mis', newMis);
                    }} />
                    <button className={styles.removeBtn} type="button" onClick={() => removeMi(idx)}>Удалить</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button type="button" onClick={generateXML} disabled={generationCounter >= 10}>Создать файл</button>
        </>
      ) : (
        <div style={{padding: '40px 0', textAlign: 'center', fontSize: 24, color: '#888'}}>Генератор Excel (в разработке)</div>
      )}
    </div>
  );
}; 