import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 32px auto;
  padding: 32px 24px 32px 24px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(58, 41, 41, 0.08);
  border-radius: 16px;
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #222;
`;

export const TopPanel = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  justify-content: space-between;
  align-items: center;
`;

export const TopPanelBtn = styled.button<{active?: boolean}>`
  flex: 1;
  min-width: 180px;
  padding: 14px 0;
  background-color: #287c3c;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  font-family: Arial, sans-serif;
  font-weight: 400;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background-color: #218838;
    color: #fff;
  }
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 28px;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 18px 16px 10px 16px;
  label {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
    color: #333;
    font-size: 15px;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    font-size: 16px;
    border: 1px solid #bdbdbd;
    border-radius: 6px;
    margin-bottom: 8px;
    background: #fff;
    transition: border 0.2s, box-shadow 0.2s;
  }
  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.10);
  }
`;

export const FormGroupQnuk1 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 24px;
  align-items: center;
  label {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
    color: #333;
    font-size: 15px;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    font-size: 16px;
    border: 1.5px solid #bdbdbd;
    border-radius: 8px;
    margin-bottom: 0;
    background: #fff;
    transition: border 0.2s, box-shadow 0.2s;
  }
  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #287c3c;
    box-shadow: 0 0 0 2px rgba(40, 124, 60, 0.10);
  }
`;

export const FullWidthField = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export const DynamicList = styled.div`
  margin-bottom: 0;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DynamicItem = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 18px 12px 12px 12px;
  box-sizing: border-box;
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
  > div {
    flex: 1;
    min-width: 200px;
  }
  select,
  input {
    font-size: 14px;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #bdbdbd;
    background: #fff;
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 0;
    transition: border 0.2s, box-shadow 0.2s;
  }
`;

export const DynamicItemWide = styled.div`
  width: 932px;
  max-width: 932px;
  min-width: 932px;
`;

export const ManufactureNumItem = styled.div<{ $highlight?: boolean }>`
  width: 932px;
  min-width: 932px;
  max-width: 932px;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 18px 12px 12px 12px;
  margin: 10px 12px 20px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px 0;
  box-sizing: border-box;
  border: 1.5px solid #bdbdbd;
  transition: box-shadow 0.3s, border 0.3s, background 0.3s;
  ${({ $highlight }) => $highlight && css`
    box-shadow: 0 0 0 3px #287c3c;
    border-color: #287c3c;
    background: #eaf7ee;
  `}
  > div {
    flex: 1 1 22%;
    min-width: 200px;
    margin-right: 16px;
    margin-bottom: 0;
  }
  > div:nth-child(5) {
    flex: 1 1 78%;
    min-width: 0;
    margin-right: 0;
    margin-top: 16px;
  }
  button {
    align-self: flex-end;
    margin-top: 16px;
    margin-left: 16px;
    height: 38px;
    white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }
  input {
    font-size: 14px;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #bdbdbd;
    background: #fff;
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 0;
    transition: border 0.2s, box-shadow 0.2s;
  }
`;

export const DynamicItemNarrow = styled.div`
  max-width: 300px;
  min-width: 265px;
  box-sizing: border-box;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  padding: 16px 12px 8px;
  background: #f9f9f9;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  input, select {
    font-size: 14px;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #bdbdbd;
    background: #fff;
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 0;
    transition: border 0.2s, box-shadow 0.2s;
  }
  button {
    align-self: flex-end;
    margin-top: 8px;
    height: 38px;
    white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }
`;

export const RemoveBtn = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 7px 14px;
  cursor: pointer;
  border-radius: 6px;
  height: 38px;
  align-self: flex-end;
  font-size: 15px;
  margin-left: 16px;
  margin-top: 16px;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background-color: #c82333;
  }
`;

export const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
`;

export const MiBlock = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 10px;
`;

export const MiHeader = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: #222;
  font-size: 16px;
`;

export const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const FileInputLabel = styled.label`
  background: #007bff;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #0056b3;
  }
`;

export const StyledSelect = styled.select`
  width: auto;
  min-width: 100px;
  max-width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

export const StyledButton = styled.button`
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 5px;
  margin-bottom: 5px;
  &:hover {
    background-color: #218838;
  }
`;

export const StyledPre = styled.pre`
  background-color: #f8f9fa;
  padding: 10px;
  border: 1px solid #ccc;
  white-space: pre-wrap;
  border-radius: 4px;
`;

export const Grid3Col = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  margin-top: 0;
  align-items: stretch;
`;

export const Card = styled.div`
  width: 300px;
  background: #fff;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 32px 18px 18px 18px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 200px;
  flex: 1 1 0;
`;

export const CardTitle = styled.label`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 14px;
  color: #222;
`;

export const CardButton = styled.button`
  width: 100%;
  padding: 12px 0;
  background-color: #287c3c;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 18px;
  margin-top: 0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background-color: #218838;
    color: #fff;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  margin-left: 0;
  text-align: left;
  color: #222;
`;

export const InfoBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 500;
  a {
    color: #287c3c;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`; 