import React, { useState, useCallback } from 'react';
import {
  Container,
  FormGroups,
  FormGroup,
  StyledSelect,
  StyledButton,
  StyledPre
} from './XMLGeneratorForm.styled';
import { ManufactureNumList } from './ManufactureNumList';
import { UveList } from './UveList';
import { SesList } from './SesList';
import { MiList } from './MiList';
import type { ManufactureNum } from './ManufactureNumList';
import type { SesItem } from './SesList';
import type { MiItem } from './MiList';

const GENERATION_LIMIT = 10;

const LOCAL_KEYS = [
  'mitypeNumber', 'signCipher', 'miOwner', 'vrfDate', 'interval', 'type', 'calibration', 'stickerNum',
  'signPass', 'signMi', 'docTitle', 'metrologist', 'temperature', 'pressure', 'humidity', 'other',
];

export const XMLGeneratorForm = () => {
  // Основные поля формы
  const [mitypeNumber, setMitypeNumber] = useState(localStorage.getItem('mitypeNumber') || '');
  const [signCipher, setSignCipher] = useState(localStorage.getItem('signCipher') || 'ДЧР');
  const [miOwner, setMiOwner] = useState(localStorage.getItem('miOwner') || '');
  const [vrfDate, setVrfDate] = useState(localStorage.getItem('vrfDate') || '');
  const [interval, setInterval] = useState(localStorage.getItem('interval') || '1');
  const [type, setType] = useState(localStorage.getItem('type') || '2');
  const [calibration, setCalibration] = useState(localStorage.getItem('calibration') || 'false');
  const [stickerNum, setStickerNum] = useState(localStorage.getItem('stickerNum') || '');
  const [signPass, setSignPass] = useState(localStorage.getItem('signPass') || 'false');
  const [signMi, setSignMi] = useState(localStorage.getItem('signMi') || 'false');
  const [docTitle, setDocTitle] = useState(localStorage.getItem('docTitle') || '');
  const [metrologist, setMetrologist] = useState(localStorage.getItem('metrologist') || '');
  const [temperature, setTemperature] = useState(localStorage.getItem('temperature') || '20,5');
  const [pressure, setPressure] = useState(localStorage.getItem('pressure') || '741,0');
  const [humidity, setHumidity] = useState(localStorage.getItem('humidity') || '55,2');
  const [other, setOther] = useState(localStorage.getItem('other') || '-');

  // Динамические списки
  const [manufactureNums, setManufactureNums] = useState<ManufactureNum[]>(() => {
    const raw = localStorage.getItem('manufactureNums');
    return raw ? JSON.parse(raw) : [];
  });
  const [uves, setUves] = useState<{ number: string }[]>(() => {
    const raw = localStorage.getItem('uves');
    return raw ? JSON.parse(raw) : [];
  });
  const [ses, setSes] = useState<SesItem[]>(() => {
    const raw = localStorage.getItem('ses');
    return raw ? JSON.parse(raw) : [];
  });
  const [mis, setMis] = useState<MiItem[]>(() => {
    const raw = localStorage.getItem('mis');
    return raw ? JSON.parse(raw) : [];
  });

  // XML вывод
  const [xml, setXml] = useState('');
  const [generationCounter, setGenerationCounter] = useState(() => {
    const raw = localStorage.getItem('xmlGenerationCounter');
    return raw ? Number(raw) : 0;
  });

  // Сохранение в localStorage
  const saveAllToLocalStorage = useCallback(() => {
    LOCAL_KEYS.forEach(key => {
      const val = eval(key);
      localStorage.setItem(key, val);
    });
    localStorage.setItem('manufactureNums', JSON.stringify(manufactureNums));
    localStorage.setItem('uves', JSON.stringify(uves));
    localStorage.setItem('ses', JSON.stringify(ses));
    localStorage.setItem('mis', JSON.stringify(mis));
  }, [manufactureNums, uves, ses, mis, mitypeNumber, signCipher, miOwner, vrfDate, interval, type, calibration, stickerNum, signPass, signMi, docTitle, metrologist, temperature, pressure, humidity, other]);

  // Очистка формы
  const clearAllFields = () => {
    setMitypeNumber(''); setSignCipher('ДЧР'); setMiOwner(''); setVrfDate(''); setInterval('1'); setType('2');
    setCalibration('false'); setStickerNum(''); setSignPass('false'); setSignMi('false'); setDocTitle('');
    setMetrologist(''); setTemperature('20,5'); setPressure('741,0'); setHumidity('55,2'); setOther('-');
    setManufactureNums([]); setUves([]); setSes([]); setMis([]); setXml('');
    LOCAL_KEYS.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('manufactureNums');
    localStorage.removeItem('uves');
    localStorage.removeItem('ses');
    localStorage.removeItem('mis');
  };

  // Генерация XML
  const generateXML = () => {
    if (generationCounter >= GENERATION_LIMIT) {
      alert('Ошибка генерации: превышен лимит');
      return;
    }
    if (!mitypeNumber || !miOwner || !vrfDate || !docTitle || !metrologist) {
      alert('Пожалуйста, заполните все обязательные поля!');
      return;
    }
    if (manufactureNums.length === 0) {
      alert('Добавьте хотя бы один номер СИ!');
      return;
    }
    const intervalNum = parseInt(interval);
    const vrfDateStr = `${vrfDate}+03:00`;
    const validDate = new Date(vrfDate);
    validDate.setFullYear(validDate.getFullYear() + intervalNum);
    validDate.setDate(validDate.getDate() - 1);
    const formattedValidDate = `${validDate.toISOString().split('T')[0]}+03:00`;
    const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>\n<gost:application xmlns:gost="urn://fgis-arshin.gost.ru/module-verifications/import/2020-06-19">\n${manufactureNums.map(mi => `    <gost:result>\n        <gost:miInfo>\n            <gost:singleMI>\n                <gost:mitypeNumber>${mitypeNumber}</gost:mitypeNumber>\n                <gost:manufactureNum>${mi.num}</gost:manufactureNum>\n                <gost:manufactureYear>${mi.year}</gost:manufactureYear>\n                <gost:modification>${mi.modification}</gost:modification>\n            </gost:singleMI>\n        </gost:miInfo>\n        <gost:signCipher>${signCipher}</gost:signCipher>\n        <gost:miOwner>${miOwner}</gost:miOwner>\n        <gost:vrfDate>${vrfDateStr}</gost:vrfDate>\n        <gost:validDate>${formattedValidDate}</gost:validDate>\n        <gost:type>${type}</gost:type>\n        <gost:calibration>${calibration}</gost:calibration>\n        <gost:applicable>\n            ${stickerNum ? `<gost:stickerNum>${stickerNum}</gost:stickerNum>` : ''}\n            <gost:signPass>${signPass}</gost:signPass>\n            <gost:signMi>${signMi}</gost:signMi>\n        </gost:applicable>\n        <gost:docTitle>${docTitle}</gost:docTitle>\n        <gost:metrologist>${metrologist}</gost:metrologist>\n        <gost:means>\n            ${uves.length > 0 ? `\n            <gost:mieta>\n                ${uves.map(u => u.number ? `<gost:number>${u.number}</gost:number>` : '').join('')}\n            </gost:mieta>` : ''}\n            ${ses.length > 0 ? `<gost:ses>\n                ${ses.map(se => `                <gost:se>\n                    ${se.typeNum ? `<gost:typeNum>${se.typeNum}</gost:typeNum>` : ''}\n                    ${se.manufactureYear ? `<gost:manufactureYear>${se.manufactureYear}</gost:manufactureYear>` : ''}\n                    ${se.manufactureNum ? `<gost:manufactureNum>${se.manufactureNum}</gost:manufactureNum>` : ''}\n                    ${se.metroChars ? `<gost:metroChars>${se.metroChars}</gost:metroChars>` : ''}\n                </gost:se>`).join('')}\n            </gost:ses>` : ''}\n            ${mis.length > 0 ? `<gost:mis>\n                ${mis.map(mi => `                <gost:mi>\n                    ${mi.typeNum ? `<gost:typeNum>${mi.typeNum}</gost:typeNum>` : ''}\n                    ${mi.manufactureNum ? `<gost:manufactureNum>${mi.manufactureNum}</gost:manufactureNum>` : ''}\n                </gost:mi>`).join('')}\n            </gost:mis>` : ''}\n        </gost:means>\n        <gost:conditions>\n            <gost:temperature>${temperature} °C</gost:temperature>\n            <gost:pressure>${pressure} мм рт.ст.</gost:pressure>\n            <gost:hymidity>${humidity} %</gost:hymidity>\n            <gost:other>${other}</gost:other>\n        </gost:conditions>\n        ${mi.structure ? `<gost:structure>${mi.structure}</gost:structure>` : ''}\n        ${mi.additionalInfo ? `<gost:additional_info>${mi.additionalInfo}</gost:additional_info>` : ''}\n    </gost:result>`).join('')}\n</gost:application>`;
    setXml(xmlStr);
    // Скачивание файла
    const fileName = `${mitypeNumber}_${vrfDate}.xml`;
    const blob = new Blob([xmlStr], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Лимит генераций
    const newCounter = generationCounter + 1;
    setGenerationCounter(newCounter);
    localStorage.setItem('xmlGenerationCounter', String(newCounter));
    saveAllToLocalStorage();
  };

  // Блокировка кнопки при лимите
  const isLimit = generationCounter >= GENERATION_LIMIT;

  // Сохранять поля при каждом изменении
  React.useEffect(() => { saveAllToLocalStorage(); }, [saveAllToLocalStorage]);

  return (
    <Container>
      <p>Автор : <a href="https://t.me/kidnaper" target="_blank" rel="noopener noreferrer">Кучугуров И.В.</a></p>
      <p>Alpha v2.0 от 17.06.2025</p>
      <h1>Генератор массовой загрузки МИЦ</h1>
      <StyledButton type="button" onClick={clearAllFields}>Очистить все поля</StyledButton>
      <form>
        <FormGroups>
          <FormGroup>
            <label htmlFor="mitypeNumber">Номер описания типа:</label>
            <input type="text" id="mitypeNumber" name="mitypeNumber" required value={mitypeNumber} onChange={e => setMitypeNumber(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <label>Номер СИ</label>
            <ManufactureNumList value={manufactureNums} onChange={setManufactureNums} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="signCipher">Шифр</label>
            <input type="text" id="signCipher" value={signCipher} onChange={e => setSignCipher(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="miOwner">Владелец СИ</label>
            <input type="text" id="miOwner" name="miOwner" required value={miOwner} onChange={e => setMiOwner(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="vrfDate">Дата проверки</label>
            <input type="date" id="vrfDate" name="vrfDate" required value={vrfDate} onChange={e => setVrfDate(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="interval">Межповерочный интервал (лет):</label>
            <StyledSelect id="interval" name="interval" required value={interval} onChange={e => setInterval(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </StyledSelect>
          </FormGroup>
          <FormGroup>
            <label htmlFor="type">Тип проверки:</label>
            <StyledSelect id="type" name="type" required value={type} onChange={e => setType(e.target.value)}>
              <option value="2">Периодическая</option>
              <option value="1">Первичная</option>
            </StyledSelect>
          </FormGroup>
          <FormGroup>
            <label htmlFor="calibration">Калибровка:</label>
            <StyledSelect id="calibration" name="calibration" required value={calibration} onChange={e => setCalibration(e.target.value)}>
              <option value="false">нет</option>
              <option value="true">да</option>
            </StyledSelect>
          </FormGroup>
          <FormGroup>
            <label htmlFor="stickerNum">Номер наклейки:</label>
            <input type="text" id="stickerNum" name="stickerNum" value={stickerNum} onChange={e => setStickerNum(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="signPass">Знак поверки в паспорте</label>
            <StyledSelect id="signPass" name="signPass" required value={signPass} onChange={e => setSignPass(e.target.value)}>
              <option value="false">нет</option>
              <option value="true">да</option>
            </StyledSelect>
          </FormGroup>
          <FormGroup>
            <label htmlFor="signMi">Знак поверки на СИ</label>
            <StyledSelect id="signMi" name="signMi" required value={signMi} onChange={e => setSignMi(e.target.value)}>
              <option value="false">нет</option>
              <option value="true">да</option>
            </StyledSelect>
          </FormGroup>
          <FormGroup>
            <label htmlFor="docTitle">Методика поверки</label>
            <input type="text" id="docTitle" name="docTitle" required value={docTitle} onChange={e => setDocTitle(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="metrologist">Поверитель</label>
            <input list="metrologistList" id="metrologist" name="metrologist" required value={metrologist} onChange={e => setMetrologist(e.target.value)} />
            <datalist id="metrologistList">
              <option value="Кучугуров И.В." />
              <option value="Зимина А.С." />
              <option value="Коваленко Н.Ю." />
              <option value="Коваленко А.Е." />
              <option value="Юрк Ю.Ю." />
            </datalist>
          </FormGroup>
        </FormGroups>
        <FormGroup>
          <label>Условия поверки</label>
          <div>
            <label htmlFor="temperature">Температура (°C):</label>
            <input type="text" id="temperature" name="temperature" required value={temperature} onChange={e => setTemperature(e.target.value)} />
          </div>
          <div>
            <label htmlFor="pressure">Давление (мм рт.ст.):</label>
            <input type="text" id="pressure" name="pressure" required value={pressure} onChange={e => setPressure(e.target.value)} />
          </div>
          <div>
            <label htmlFor="humidity">Влажность (%):</label>
            <input type="text" id="humidity" name="humidity" required value={humidity} onChange={e => setHumidity(e.target.value)} />
          </div>
          <div>
            <label htmlFor="other">Прочие условия:</label>
            <input type="text" id="other" name="other" required value={other} onChange={e => setOther(e.target.value)} />
          </div>
        </FormGroup>
        <FormGroup>
          <label>Эталоны, применяемые при поверке</label>
          <UveList value={uves} onChange={setUves} />
        </FormGroup>
        <FormGroup>
          <label>Стандартные образцы, применяемые при поверке</label>
          <SesList value={ses} onChange={setSes} />
        </FormGroup>
        <FormGroup>
          <label>СИ, применяемые при поверке</label>
          <MiList value={mis} onChange={setMis} />
        </FormGroup>
        <StyledButton type="button" onClick={generateXML} disabled={isLimit}>Создать файл</StyledButton>
      </form>
      <h2>Сгенерированный XML:</h2>
      <StyledPre>{xml}</StyledPre>
      {isLimit && <div style={{color: 'red', marginTop: 8}}>Достигнут лимит генераций XML</div>}
    </Container>
  );
}; 