import styled from 'styled-components';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 0;
  font-family: Arial, sans-serif;
`;

export const FormWrapper = styled.div`
  max-width: 520px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(58, 41, 41, 0.1);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Title = styled.h2`
  text-align: center;
  color: #333;
  font-weight: 700;
  font-size: 26px;
  margin: 0;
`;

export const FileInputLabel = styled.label`
  font-weight: 500;
  color: #222;
  margin-bottom: 10px;
  display: block;
`;

export const FileInput = styled.input`
  margin-top: 8px;
  width: 100%;
  padding: 10px;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  font-size: 16px;
  background: #fff;
`;

export const InfoText = styled.div`
  color: #888;
  font-size: 14px;
  margin-top: 4px;
`;

export const FlexRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const TextInput = styled.input`
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #bdbdbd;
  font-size: 16px;
  background: #fff;
`;

export const AddButton = styled.button`
  margin-top: 8px;
  background: #90EE90;
  color: #222;
  border: none;
  border-radius: 4px;
  padding: 10px 18px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.3s;
  &:hover {
    background: #28a745;
    color: #fff;
  }
`;

export const RemoveButton = styled.button`
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 7px 14px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const AddressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const GenerateButton = styled.button<{disabled?: boolean}>`
  margin-top: 8px;
  background: ${({disabled}) => disabled ? '#6c757d' : '#90EE90'};
  color: #222;
  border: none;
  border-radius: 4px;
  padding: 14px 0;
  font-weight: 700;
  font-size: 18px;
  cursor: ${({disabled}) => disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s;
  box-shadow: 0 2px 8px 0 rgba(60,80,180,0.07);
  width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  &:hover {
    background: ${({disabled}) => disabled ? '#6c757d' : '#28a745'};
    color: ${({disabled}) => disabled ? '#222' : '#fff'};
  }
`;

export const ErrorText = styled.div`
  color: #ef4444;
  font-weight: 500;
  margin-top: 8px;
  text-align: center;
`;
